/* Original procedural teaching models. Three.js r160; no external model or texture assets. */
(() => {
  'use strict';
  const U = {};
  U.random = (seed = 17) => () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  U.material = (T, color, extra = {}) => new T.MeshStandardMaterial({
    color, roughness: 0.61, metalness: 0, ...extra
  });
  U.mesh = (T, geometry, material, group) => {
    const m = new T.Mesh(geometry, material);
    m.castShadow = true; m.receiveShadow = true;
    if (group) group.add(m);
    return m;
  };
  U.organic = (T, radius = 1, detail = 0.025, segments = 40, rings = 28) => {
    const g = new T.SphereGeometry(radius, segments, rings), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / radius, y = p.getY(i) / radius, z = p.getZ(i) / radius;
      const d = 1 + detail * (Math.sin(x * 9 + y * 5) * Math.cos(z * 7 - y * 4) + 0.38 * Math.sin(y * 19 + z * 11));
      p.setXYZ(i, x * radius * d, y * radius * d, z * radius * d);
    }
    g.computeVertexNormals(); return g;
  };
  U.ellipsoid = (T, group, material, position, scale, detail = 0.02) => {
    const m = U.mesh(T, U.organic(T, 1, detail), material, group);
    m.position.set(...position); m.scale.set(...scale); return m;
  };
  U.tubeGeometry = (T, points, radiusStart, radiusEnd, segments = 24, sides = 8) => {
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
    const frames = curve.computeFrenetFrames(segments, false), positions = [], indices = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, v = curve.getPointAt(t);
      const r = radiusStart * (1 - t) + radiusEnd * t;
      for (let j = 0; j <= sides; j++) {
        const a = j / sides * Math.PI * 2;
        const n = frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a));
        positions.push(v.x + n.x * r, v.y + n.y * r, v.z + n.z * r);
        if (i < segments && j < sides) {
          const q = i * (sides + 1) + j, k = q + sides + 1;
          indices.push(q, q + 1, k, k, q + 1, k + 1);
        }
      }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    g.setIndex(indices); g.computeVertexNormals(); return g;
  };
  U.tube = (T, group, mat, points, r1, r2, segments, sides) => U.mesh(T, U.tubeGeometry(T, points, r1, r2, segments, sides), mat, group);
  // Merge geometries sharing one material, to keep fine biological detail inexpensive.
  U.merge = (T, geometries) => {
    const pos = [], normal = [];
    for (const original of geometries) {
      const g = original.index ? original.toNonIndexed() : original;
      pos.push(...g.attributes.position.array); normal.push(...g.attributes.normal.array);
      if (g !== original) g.dispose(); original.dispose();
    }
    const merged = new T.BufferGeometry();
    merged.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    merged.setAttribute('normal', new T.Float32BufferAttribute(normal, 3)); return merged;
  };
  // Open anterior surface is an explicit cutaway, not transparent intact tissue.
  U.cutawayShell = (T, group, material, position, scale, opening = 0.85, detail = 0.018) => {
    const points = [], indices = [], around = 64, rows = 32;
    for (let i = 0; i <= rows; i++) {
      const a = opening + (Math.PI - opening) * i / rows;
      for (let j = 0; j <= around; j++) {
        const b = j / around * Math.PI * 2;
        const x = Math.sin(a) * Math.cos(b), y = Math.sin(a) * Math.sin(b), z = Math.cos(a);
        const d = 1 + detail * (Math.sin(x * 8 + y * 5) * Math.cos(z * 7) + 0.3 * Math.sin(y * 17));
        points.push(position[0] + x * scale[0] * d, position[1] + y * scale[1] * d, position[2] + z * scale[2] * d);
        if (i < rows && j < around) { const q = i * (around + 1) + j, k = q + around + 1; indices.push(q, k, q + 1, q + 1, k, k + 1); }
      }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(points, 3)); g.setIndex(indices); g.computeVertexNormals();
    const m = U.mesh(T, g, material, group); m.material.side = T.DoubleSide;
    const lip = [];
    for (let j = 0; j <= 64; j++) {
      const b = j / 64 * Math.PI * 2;
      lip.push([position[0] + Math.sin(opening) * Math.cos(b) * scale[0], position[1] + Math.sin(opening) * Math.sin(b) * scale[1], position[2] + Math.cos(opening) * scale[2]]);
    }
    U.tube(T, group, material, lip, 0.018, 0.018, 64, 6); return m;
  };
  U.instances = (T, geometry, material, transforms, group) => {
    const batch = new T.InstancedMesh(geometry, material, transforms.length), dummy = new T.Object3D();
    transforms.forEach((t, i) => {
      dummy.position.set(...t.position); dummy.scale.set(...(t.scale || [1, 1, 1]));
      dummy.rotation.set(...(t.rotation || [0, 0, 0])); dummy.updateMatrix(); batch.setMatrixAt(i, dummy.matrix);
    });
    batch.castShadow = true; batch.receiveShadow = true; group.add(batch); return batch;
  };
  // Intact mitochondria are shown from outside; internal cristae are not exposed.
  U.mitochondria = (T, parent, entries, scale = 1) => {
    const group = new T.Group(); parent.add(group);
    const outer = U.material(T, '#be7651', { roughness: 0.68 });
    const bodies = [];
    entries.forEach(e => {
      const a = e.angle || 0;
      const sy = e.size || 1, long = 0.22 * scale * sy, short = 0.095 * scale * sy;
      bodies.push({ position: e.position, scale: [long, short, short * 0.75], rotation: [0, 0, a] });
    });
    U.instances(T, new T.SphereGeometry(1, 18, 12), outer, bodies, group);
    return group;
  };
  U.label = (T, text, xyz, side = 'right') => ({ text, position: new T.Vector3(...xyz), side });
  window.COVER_CELL_UTILS = U;
  window.COVER_CELL_BUILDERS = window.COVER_CELL_BUILDERS || {};
})();
