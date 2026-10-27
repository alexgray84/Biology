/* Lesson 3 · Hidden reviews for original classroom practice.
   Each screen and task variant has a defensible model and subject-quality criteria.
   These are not exam-board questions or an exam-board mark scheme. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const main={
    'do-now':A([
      m('1 · Substances used and made','Used: carbon dioxide and water. Made: glucose and oxygen. Light supplies energy; chlorophyll absorbs light. Light and chlorophyll are not the substances supplying the atoms in the products.'),
      m('2 · Structure and pigment','Photosynthesis happens in chloroplasts. Chlorophyll is the pigment that absorbs light energy. Distinguish the cell structure from the pigment inside it.'),
      m('3 · Net diffusion','A → B, from the higher gas concentration to the lower. Individual particles still move in both directions; net describes the overall result.'),
      m('Correct one gap','Keep your first answer and write a corrected scientific statement beside it. For example, replace “chlorophyll is an organelle” with “a chloroplast is the cell structure; chlorophyll is its light-absorbing pigment”.')
    ],[c('What to check',['Two correct input substances and two correct products.','Chloroplast and chlorophyll distinguished.','Net direction follows the stated concentration difference.','Correction states accurate science, not just a tick.'])]),

    outcomes:S('What today’s evidence will show','An annotated section and four causal explanations: two for light and two for gas exchange. A visible revision improves a specific scientific link. The separate fresh response checks the idea with content help closed. Use your book and supplied outline or the designed equivalent.',['Locate structures and connect the gas route.','Explain the physical effect of each chosen feature.','Distinguish the route from the gradient causing net movement.']),

    'leaf-light':A([
      m('Locate the structures','The cuticle is the outer coating; the upper epidermis is the surface cell layer beneath it. Palisade cells lie below the upper epidermis in this typical terrestrial broad-leaf section. Chloroplasts are inside mesophyll cells. Labels must point to the structure, not an adjacent space.'),
      m('Property and light arrow','Transparency allows light to pass through the upper surface/epidermis to photosynthesising cells below. Draw incoming light towards the upper surface and into the palisade region. Position alone does not explain why light passes through.'),
      m('Chloroplasts and the vein','Chlorophyll in chloroplasts absorbs light. Many chloroplasts in palisade cells near the illuminated surface support light absorption. The vein contains xylem supplying water and phloem carrying dissolved sugars away. The model is schematic and does not represent every species.'),
      m('Using the model controls','A useful observation identifies the same named structures after changing the view or magnification. Rotation and label visibility change the representation, not the underlying biology. The model does not establish a photosynthesis rate.')
    ],[c('Success criteria',['Accurate label endpoints.','Transparency linked to light passing through.','Chloroplast distinguished from chlorophyll.','Vein supply/export described accurately when included.']),c('Important distinctions',['Do not say the cuticle absorbs the light needed by palisade cells.','Do not say every epidermal cell contains many chloroplasts.','Do not claim every leaf has an identical tissue arrangement.'])]),

    'leaf-gas':A([
      m('Complete the lower section','Spongy mesophyll cells border connected air spaces. The epidermis forms a surface layer. A stoma is a pore in the epidermis; guard cells border it. Distinguish cells, spaces and openings in the labels.'),
      m('CO₂ route','Outside air → open stomatal pore → internal air spaces → moist mesophyll surface → into the cell. Gases dissolve in moisture before entering the cells. Do not require a separate chloroplast-entry arrow on this schematic.'),
      m('Why net movement is inward here','CO₂ concentration is higher outside than inside, so net diffusion follows that gradient into the leaf. The leaf’s use of CO₂ in photosynthesis can maintain an inward gradient under suitable conditions. The open pore enables exchange; it does not cause active pumping.'),
      m('Regulate rather than pump','Guard cells regulate the width of the stomatal opening. Gases diffuse through open pores down their own concentration gradients. CO₂ does not always move inward; use the condition stated in each question.')
    ],[c('Success criteria',['Pore and guard cells distinguished.','Continuous route reaches mesophyll cells.','Moist surface and air spaces described appropriately.','Direction justified with the stated CO₂ concentration comparison.']),c('Do not accept',['CO₂ is mainly delivered in the xylem from roots.','Guard cells pump the gas in.','The air spaces manufacture the gases.'])]),

    'stoma-check':S('Opening and surrounding cells','Circle the opening between the pair of guard cells. Place the dot inside one bordering guard cell, not in the opening. Guard cells regulate the width/opening of the pore. One opening is a stoma; more than one are stomata.',['Opening identified as a pore.','A guard cell identified as a cell beside the pore.','Regulation described without claiming the cells pump gases.']),

    'explanation-model':A([
      m('The missing scientific link','The near-miss says the feature is good for photosynthesis but omits its physical effect: light passes through the transparent epidermis to photosynthesising cells below.'),
      m('Locate the three parts','Feature/property: transparent upper epidermis. Physical effect: light passes through to palisade cells. Biological benefit: chlorophyll in their chloroplasts absorbs light for photosynthesis.'),
      m('The modelled self-correction','The first idea, “good for photosynthesis”, conceals the mechanism. The corrected explanation supplies how: light passes through to the cells where it is absorbed. The useful revision adds this relationship rather than simply adding words.'),
      m('A concise equivalent is acceptable','“The transparent upper epidermis lets light reach chloroplast-rich palisade tissue for photosynthesis” contains the relevant relationship. A longer paragraph is not automatically better; credit an accurate sentence or labelled causal chain.')
    ],[c('Success criteria',['Identify the missing mechanism.','Locate the physical effect in the stronger explanation.','Keep feature, effect and biological benefit connected.','Explain the quality difference without judging length.'])]),

    'guided-airspaces':A([
      m('One complete chain','Air spaces connect open stomatal pores/outside air to mesophyll surfaces. This allows gases to diffuse between the outside and those surfaces. Accept an equivalent labelled causal diagram.'),
      m('Explain one arrow','The opening provides access to the internal spaces. Gases move through connected spaces towards/from the cell surfaces by diffusion; the direction of net movement depends on the relevant concentration gradient.')
    ],[c('Success criteria',['Names both ends of the connection.','Gives a physical effect on gas exchange.','Does not turn an air space into a pumping structure.'])]),

    'guided-thin':A([
      m('Model · 2 marks','A thin leaf has a short diffusion distance between outside air and mesophyll cells. Gases can therefore diffuse to or from those cells more quickly under otherwise comparable conditions.'),
      m('Distinguish a label from an explanation','“The leaf is thin” repeats the question and earns no credit alone. Add the shorter diffusion path and its consequence. “There is more space” does not express the distance mechanism.')
    ],[c('Original classroom mark scheme · 2 marks',['Short diffusion distance between outside air and mesophyll cells [1].','Faster diffusion/gas exchange with those cells as a consequence [1].']),c('Accept and distinguish',['Accept an accurate labelled causal chain instead of prose.','Award the two distinct scientific points; do not double-count “thin” and “short distance”.','Assume other relevant conditions are comparable; do not claim gas exchange must be fastest in every thin leaf.'])],2),

    'co2-hinge':A([
      m('B · Correct route and process','CO₂ enters mainly through open stomata, diffuses through internal air spaces, and reaches mesophyll surfaces/cells. Its concentration is higher outside than inside, so its net diffusion is inward.'),
      m('A · Surface versus pore','The open pore is the main route in this example. The waxy surface restricts exchange; avoid the absolute claim that no gas can ever cross a cuticle.'),
      m('C · Different substances and routes','Xylem delivers water from roots. The leaf’s main CO₂ supply comes from the surrounding air, not from water transported up the xylem.'),
      m('D · Regulation versus pumping','Guard cells regulate the pore. They do not actively transport CO₂ through it. The CO₂ concentration difference explains the net direction.')
    ],[c('Success criteria',['Choose B.','Give a continuous route to mesophyll cells.','Use higher outside and lower inside to justify net direction.','A correct letter without the concentration explanation is incomplete evidence.'])]),

    'route-recheck':S('O₂ goes net outward in this condition','Mesophyll → internal air spaces → open stomatal pore → outside. O₂ is higher inside than outside, so it diffuses net out down its concentration gradient. Individual molecules can still move both ways.',['Correct outward route.','Uses the O₂ concentration comparison.','Does not claim guard cells pump the gas.']),

    independent:A([
      m('Annotated section','Locate cuticle, upper epidermis, palisade mesophyll, chloroplasts, spongy mesophyll, air spaces, lower epidermis, stomatal pore, guard cells and vein where shown. Accurate endpoints matter. The supplied outline removes copying; it does not replace the pupil’s labels and explanations.'),
      m('CO₂ route and direction','Outside air → open stomatal pore → internal air spaces → moist mesophyll surface → cell. Net CO₂ movement is inward for the stated higher-outside concentration. Keep route and concentration reasoning distinct.'),
      m('Light example · broad lamina','A broad, flat lamina exposes a large area to incoming light, supporting light interception. This is a structure–function link, not a claim that a larger leaf must always have a higher photosynthesis rate.'),
      m('Light example · transparent surface','A transparent upper epidermis lets light reach photosynthesising mesophyll cells below, where chlorophyll can absorb it for photosynthesis.'),
      m('Light alternative · palisade tissue','Many chloroplasts in palisade cells near the illuminated surface support light absorption. Distinguish positioning and chloroplast content where used; do not count two synonyms for one feature as separate explanations.'),
      m('Gas example · pores','Open stomata connect outside air and internal air spaces. They enable gas exchange. Net movement is caused by the concentration gradient of the gas, not by pumping from the guard cells.'),
      m('Gas example · connected spaces and surfaces','Connected air spaces allow gases to spread through the leaf and reach extensive mesophyll surfaces. Gases dissolve in moisture before entering cells. A coherent explanation may use connected spaces or extensive moist exchange surfaces as a distinct feature.'),
      m('Gas alternative · short path','A thin leaf/short internal path reduces diffusion distance between outside air and mesophyll cells, supporting faster exchange under otherwise comparable conditions.'),
      m('Review the evidence honestly','Accept sentences, accurate labelled causal chains or the designed typed/annotated equivalent. Note content assistance separately. A scientifically strong supported explanation is not labelled unaided. For changed-condition tasks, use that variant’s own review in HOT/the practice resource.')
    ],[c('Subject-quality criteria',['Labels are coherent and the CO₂ route reaches a cell.','Two distinct light features each have a physical effect and biological link.','Two distinct gas features each have a mechanism.','Net direction uses the relevant concentration difference.']),c('Accept and distinguish',['Accept accurate alternatives that preserve the mechanism.','A four-label list is not four explanations.','Do not double-count synonyms as two adaptations.','Spelling, length and speed do not substitute for scientific quality.'])]),

    'review-gap':A([
      m('A precise review decision','Choose a gap visible in the response. Example: “I named transparency but did not say light reaches the cells below.” This identifies an assessable scientific improvement. “Add detail” alone is not precise enough.'),
      m('If the route lacks its reason','A route arrow shows where gas passes. Add the concentration comparison explaining its net direction. If both are already sound, improve precision or state the condition rather than inventing a mistake.'),
      m('What to point to','Identify the sentence, arrow or label you will change and the criterion it addresses. The model supports checking; copying it without identifying the gap does not show a review decision.')
    ],[c('Success criteria',['Gap is supported by the pupil’s actual work.','Improvement targets science, not appearance alone.','A particular sentence/arrow is selected for revision.'])]),

    revision:A([
      m('Example · effect added','Before: “The epidermis is transparent, which helps photosynthesis.” After: “The transparent upper epidermis lets light pass to palisade cells, where chlorophyll in chloroplasts absorbs it for photosynthesis.” The added link is the path of light.'),
      m('Example · gradient added','Before: “CO₂ enters through stomata.” After: “CO₂ diffuses net from higher concentration outside, through open stomata and internal air spaces, to lower concentration at mesophyll cells.” The direction now has a cause.'),
      m('Example · condition added','Before: “More stomata always make photosynthesis faster.” After: “More open stomata may help when CO₂ entry limits the rate; they do not remove a light limit.” The revision removes an unjustified universal claim.'),
      m('Check the change','Keep the first attempt and revised version. Point out the new scientific link. Apply the same improvement to a second explanation where appropriate. A secure explanation may be made more precise; there is no requirement to invent an error.')
    ],[c('Success criteria',['Revision makes a visible scientific change.','The changed link responds to the identified gap.','A second application is checked where possible.','Do not treat copying or colour change alone as improvement.'])]),

    'fresh-check':A([
      m('1 · New CO₂ condition','Mesophyll/internal cell surfaces → internal air spaces → open stomata → outside. CO₂ is higher inside than outside in this question, so its net diffusion is outward down the stated gradient. No explanation of how the condition arose is required.'),
      m('2 · Longer path in B','The longer internal path increases diffusion distance, so gas exchange can be slower/less efficient than in A under the stated otherwise comparable conditions. Equal surface area and equal numbers of open pores do not remove that distance difference.'),
      m('Distinguish understanding from a memorised route','Reject “CO₂ must always enter a leaf”. The direction depends on the stated concentration gradient. Do not require respiration knowledge or an explanation of why inside CO₂ became higher.')
    ],[c('Fresh-check criteria',['Correct outward route for the supplied condition.','Correct higher-to-lower concentration explanation.','Defensible consequence of a longer diffusion path.']),c('Evidence conditions',['Judge the separate response with content hints/models closed.','Retain necessary reading, enlargement and appropriate response tools.','This classroom check is not a protected examination system.'])])
  };
  return {main};
})();
