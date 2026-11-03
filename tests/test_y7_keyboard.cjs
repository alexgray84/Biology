/* Runtime regressions: node --test tests/test_y7_keyboard.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const unit = path.join(root, 'current/year-7/cells-and-living-things');
const standardDirs = Array.from({ length: 8 }, (_, i) => path.join(unit, `${String(i + 1).padStart(2, '0')} Resources`));
const coverDir = path.join(unit, '06 Cover Resources');

// A small DOM surface for the real renderers; no handlers are copied or extracted.
function environment() {
  const nodes = new Map();
  let document;
  class Element {
    constructor(tag = 'div', attrs = {}, parent = null) {
      this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.parentElement = parent;
      this.dataset = {}; this.children = []; this.listeners = {}; this.innerHTML = ''; this.isConnected = true;
      this.id = attrs.id || ''; this.className = attrs.class || '';
      for (const [key, value] of Object.entries(attrs)) if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      const classes = new Set(this.className.split(/\s+/).filter(Boolean));
      this.classList = { add: (...values) => values.forEach(v => classes.add(v)), remove: (...values) => values.forEach(v => classes.delete(v)), toggle: (v, on) => on ? classes.add(v) : classes.delete(v), contains: v => classes.has(v) };
    }
    get isContentEditable() {
      const own = this.attrs.contenteditable;
      return own === undefined ? Boolean(this.parentElement?.isContentEditable) : own !== 'false';
    }
    matches(selector) {
      return selector.split(',').some(part => {
        part = part.trim();
        const tag = part.match(/^[a-z]+/i)?.[0];
        if (tag && this.tagName !== tag.toUpperCase()) return false;
        const id = part.match(/#([\w-]+)/)?.[1];
        if (id && this.id !== id) return false;
        for (const match of part.matchAll(/\.([\w-]+)/g)) if (!this.className.split(/\s+/).includes(match[1])) return false;
        for (const match of part.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) {
          if (!(match[1] in this.attrs) || (match[2] !== undefined && this.attrs[match[1]] !== match[2])) return false;
        }
        return true;
      });
    }
    closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
    setAttribute(key, value) { this.attrs[key] = String(value); }
    getAttribute(key) { return this.attrs[key] ?? null; }
    addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
    removeEventListener(type, callback) { this.listeners[type] = (this.listeners[type] || []).filter(fn => fn !== callback); }
    dispatch(type, event = {}) { event.target ||= this; event.currentTarget = this; for (const fn of this.listeners[type] || []) fn(event); }
    focus() { document.activeElement = this; }
    append(...children) { for (const child of children) { child.parentElement = this; this.children.push(child); } }
    appendChild(child) { this.append(child); return child; }
    prepend(child) { child.parentElement = this; this.children.unshift(child); }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    remove() { this.isConnected = false; }
    getBoundingClientRect() { return { width: 800, height: 500 }; }
    getContext(type) {
      if (type !== '2d') return { getExtension: () => null };
      return { measureText: text => ({ width: text.length * 22 }), beginPath() {}, roundRect() {}, rect() {}, fill() {}, stroke() {}, fillText() {} };
    }
    querySelector(selector) {
      const direct = this.children.find(child => child.matches(selector));
      if (direct) return direct;
      for (const child of this.children) { const match = child.querySelector(selector); if (match) return match; }
      // Parse elements produced by the real renderer only when a test/runtime queries them.
      for (const tag of this.innerHTML.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
        const attrs = Object.fromEntries([...tag[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
        const node = new Element(tag[1], attrs, this);
        if (node.matches(selector)) return node;
      }
      return null;
    }
    querySelectorAll(selector) { return this.children.filter(child => child.matches(selector)); }
  }
  document = new Element('document');
  document.getElementById = id => {
    if (!nodes.has(id)) nodes.set(id, new Element('div', { id }));
    return nodes.get(id);
  };
  document.createElement = tag => new Element(tag);
  document.createElementNS = (_, tag) => new Element(tag);
  const topic = new Element('div', { class: 'topic' });
  const widget = new Element('button', { 'data-action': 'widget', 'data-value': 'resources', 'data-widget': 'resources' });
  document.querySelector = selector => selector === '.topic' ? topic : widget.matches(selector) ? widget : null;
  document.querySelectorAll = selector => widget.matches(selector) ? [widget] : [];
  document.currentScript = { src: 'https://example.test/resources/cell-viewer.js' };
  const location = { hash: '' };
  const sandbox = { document, location, console: { log() {}, warn() {}, error() {} }, URL, AbortController,
    Image: class extends Element {}, ResizeObserver: class { observe() {} disconnect() {} },
    setInterval() {}, setTimeout() {}, requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    history: { replaceState: (_, __, hash) => { location.hash = hash; } }, addEventListener() {}, matchMedia: () => ({ matches: true }) };
  sandbox.window = sandbox; sandbox.self = sandbox;
  const context = vm.createContext(sandbox);
  const execute = file => vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  const key = (key, target = document, extras = {}) => {
    const event = { key, target, defaultPrevented: false, propagationStopped: false, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.propagationStopped = true; }, ...extras };
    if (target !== document) target.dispatch('keydown', event);
    if (!event.propagationStopped) document.dispatch('keydown', event);
    return event;
  };
  return { context, document, Element, execute, key, widget, node: id => document.getElementById(id) };
}

function runtime(directory) {
  const env = environment();
  const panel = { title: 'Resources', subtitle: '', tabs: [{ label: 'First', pages: [{ heading: 'One' }] }, { label: 'Second', pages: [{ heading: 'Two' }] }] };
  if (directory === coverDir) {
    env.context.COVER_DATA = { screens: ['first', 'second', 'third'].map(id => ({ id, family: 'Input', title: id, html: '<p>Read.</p>' })), widgets: { resources: [{ title: 'Read', html: '<p>Resource</p>' }] } };
    env.context.COVER_DIAGRAMS = {};
    env.execute(path.join(directory, 'cover-runtime.js'));
    env.index = () => ['first', 'second', 'third'].indexOf(env.node('app').dataset.screenId);
    env.open = () => env.node('tools').dispatch('click', { target: env.widget });
    env.isOpen = () => !env.node('panel').hidden;
  } else {
    env.context.LESSON = { title: 'Lesson', unit: 'Cells', path: [], phases: ['first', 'second', 'third'].map(id => ({ id, type: 'text', family: 'Input', title: id })) };
    env.context.LessonAnswers = { has: () => false, widget: () => false, panel: () => panel };
    env.context.LessonWidgets = { panel: () => panel };
    env.execute(path.join(directory, 'lesson-runtime.js'));
    env.index = () => env.context.LessonDebug.index();
    env.open = () => env.document.dispatch('click', { target: env.widget });
    env.isOpen = () => !env.node('student-drawer').hidden;
  }
  return env;
}

for (const directory of [...standardDirs, coverDir]) {
  const label = path.basename(directory);
  test(`${label}: arrows navigate from ordinary controls, nested content and after closing Resources`, () => {
    const env = runtime(directory);
    for (const tag of ['button', 'a']) {
      const control = new env.Element(tag);
      const child = new env.Element('span', {}, control);
      assert.equal(env.key('ArrowRight', child).defaultPrevented, true);
      assert.equal(env.index(), 1);
      env.key('ArrowLeft', control);
      assert.equal(env.index(), 0);
    }
    env.open(); assert.equal(env.isOpen(), true);
    env.key('Escape'); assert.equal(env.isOpen(), false);
    assert.equal(env.document.activeElement, env.widget);
    env.key('ArrowRight', env.document.activeElement);
    assert.equal(env.index(), 1);
    env.key('ArrowRight'); env.key('ArrowRight'); assert.equal(env.index(), 2);
    env.key('ArrowLeft'); env.key('ArrowLeft'); env.key('ArrowLeft'); assert.equal(env.index(), 0);
  });
  test(`${label}: native shortcuts, modified arrows and handled events are untouched`, () => {
    const env = runtime(directory);
    for (const modifier of ['metaKey', 'ctrlKey', 'altKey']) {
      for (const key of ['ArrowRight', 'ArrowLeft', '+', '-', '0']) {
        assert.equal(env.key(key, env.document, { [modifier]: true }).defaultPrevented, false);
        assert.equal(env.index(), 0);
      }
      env.open(); env.key('Escape', env.document, { [modifier]: true }); assert.equal(env.isOpen(), true);
      env.key('Escape');
    }
    for (const key of ['+', '-', '0', 'ArrowUp', 'ArrowDown']) assert.equal(env.key(key).defaultPrevented, false);
    env.key('ArrowRight', env.document, { defaultPrevented: true }); assert.equal(env.index(), 0);
    env.open(); env.key('Escape', env.document, { defaultPrevented: true }); assert.equal(env.isOpen(), true);
  });
  test(`${label}: editing, canvas and arrow-owning ARIA controls retain their keys`, () => {
    const env = runtime(directory);
    const targets = ['input', 'select', 'textarea', 'canvas'].map(tag => new env.Element(tag));
    targets.push(new env.Element('span', {}, new env.Element('div', { contenteditable: 'true' })));
    for (const role of ['slider', 'spinbutton', 'combobox', 'listbox', 'option', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'tree', 'treeitem', 'treegrid', 'grid', 'gridcell', 'radiogroup', 'radio', 'tablist', 'tab']) {
      targets.push(new env.Element('span', {}, new env.Element('div', { role })));
    }
    for (const target of targets) {
      assert.equal(env.key('ArrowRight', target).defaultPrevented, false, target.parentElement?.attrs.role || target.tagName);
      assert.equal(env.index(), 0);
    }
  });
  if (directory !== coverDir) test(`${label}: drawer tabs keep their own plain arrows and expose a focusable reading region`, () => {
    const env = runtime(directory);
    env.open();
    const tab = new env.Element('button', { role: 'tab' }, new env.Element('div', { class: 'drawer-tabs', role: 'tablist' }));
    for (const modifier of ['metaKey', 'ctrlKey', 'altKey']) {
      const before = env.node('student-drawer').innerHTML;
      assert.equal(env.key('ArrowRight', tab, { [modifier]: true }).defaultPrevented, false);
      assert.equal(env.node('student-drawer').innerHTML, before);
    }
    assert.equal(env.key('ArrowRight', tab).defaultPrevented, true);
    assert.equal(env.document.activeElement, env.node('widget-tab-1'));
    assert.equal(env.index(), 0);
    env.key('ArrowLeft', tab); assert.equal(env.document.activeElement, env.node('widget-tab-0'));
    const body = env.node('student-drawer').querySelector('[role="tabpanel"]');
    assert.equal(body.getAttribute('tabindex'), '0');
  });
}

// Use the bundled geometry code and actual mount IIFEs; replace only browser rendering.
function addThree(env, directory) {
  env.execute(path.join(directory, 'three.min.js'));
  env.context.THREE.WebGLRenderer = class {
    constructor() { this.domElement = new env.Element('canvas'); }
    getContext() { return {}; } setPixelRatio() {} setClearColor() {} setSize() {} render() {} dispose() {} forceContextLoss() {}
  };
}
for (const directory of standardDirs.slice(1)) test(`${path.basename(directory)} model: modified keys stay native while plain arrows rotate`, () => {
  const env = environment(); addThree(env, directory);
  env.execute(path.join(directory, 'cell-models.js'));
  const host = new env.Element('div'), state = { cell: 'animal', labels: true };
  const instance = env.context.LessonModels.cell.mount(host, state, {}, {});
  assert.ok(instance, 'the actual model mounted');
  const canvas = host.children.find(child => child.tagName === 'CANVAS');
  for (const modifier of ['metaKey', 'ctrlKey', 'altKey']) {
    for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '0']) {
      const before = [host.__cellDebug.world.rotation.x, host.__cellDebug.world.rotation.y];
      assert.equal(env.key(key, canvas, { [modifier]: true }).defaultPrevented, false);
      assert.deepEqual([host.__cellDebug.world.rotation.x, host.__cellDebug.world.rotation.y], before);
    }
  }
  const before = host.__cellDebug.world.rotation.y;
  env.key('ArrowRight', canvas, { defaultPrevented: true }); assert.equal(host.__cellDebug.world.rotation.y, before);
  assert.equal(env.key('ArrowRight', canvas).defaultPrevented, true);
  assert.equal(host.__cellDebug.world.rotation.y, before + .15);
  assert.equal(env.key('ArrowUp', canvas).defaultPrevented, true);
  assert.equal(state.rx, .32 - .12);
  for (const key of ['+', '-', '0']) assert.equal(env.key(key, canvas).defaultPrevented, false);
  instance.dispose();
});
test('Cover model: modified keys stay native while plain arrows rotate', () => {
  const env = environment(); addThree(env, coverDir);
  let object;
  env.context.COVER_CELL_BUILDERS = { rbc: () => ({ object: object = new env.context.THREE.Group(), labels: [] }) };
  env.execute(path.join(coverDir, 'cell-viewer.js'));
  const host = new env.Element('div');
  const instance = env.context.COVER_CELL_VIEWER.mount(host, 'rbc');
  const canvas = host.children.flatMap(child => child.children).find(child => child.tagName === 'CANVAS');
  assert.ok(canvas, 'the actual viewer registered a model canvas');
  for (const modifier of ['metaKey', 'ctrlKey', 'altKey']) {
    for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '0']) {
      const before = [object.rotation.x, object.rotation.y];
      assert.equal(env.key(key, canvas, { [modifier]: true }).defaultPrevented, false);
      assert.deepEqual([object.rotation.x, object.rotation.y], before);
    }
  }
  env.key('ArrowRight', canvas, { defaultPrevented: true }); assert.equal(object.rotation.y, .16);
  assert.equal(env.key('ArrowRight', canvas).defaultPrevented, true); assert.equal(object.rotation.y, .28);
  assert.equal(env.key('ArrowUp', canvas).defaultPrevented, true); assert.equal(object.rotation.x, .05 - .12);
  for (const key of ['+', '-', '0']) assert.equal(env.key(key, canvas).defaultPrevented, false);
  instance.dispose();
});
