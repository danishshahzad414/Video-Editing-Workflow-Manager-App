/**
 * Beat 2 — The Three Pillars Drop  [v2 — IMPACT EDITION]
 *
 * Upgrades over v1:
 *  - Spring bounce scale  (150 → 97 → 103 → 100, 4-key overshoot)
 *  - Slam Y position      (drops from above, overshoots, settles)
 *  - Blurred light leak   (Fast Box Blur horizontal → soft gradient streak)
 *  - Impact flash         (accent-color ADD solid, 3-frame fade)
 *  - Colored text stroke  (accent color outlines white text)
 *  - Drop shadow          (AE effect, depth/impact)
 *  - Elliptical vignette  (per card, adds cinematic depth)
 *  - Motion blur          (enabled comp + text layer)
 *
 * Run: AE > File > Scripts > Run Script File
 * Font: BebasNeue-Regular  (swap to Anton-Regular or Impact if missing)
 */

(function Beat2_v2() {

    // ─────────────────────────────────────────────
    // CONFIG
    // ─────────────────────────────────────────────
    var CFG = {
        fps          : 24,
        W            : 1920,
        H            : 1080,
        bg           : [0.039, 0.039, 0.039],   // #0A0A0A

        cardDur      : 1.5,
        outroDur     : 2.5,
        gapFrames    : 1,

        font         : "BebasNeue-Regular",      // → Anton-Regular → Impact
        fontSize     : 160,
        tracking     : 80,
        strokeWidth  : 6,

        leakOpacity  : 55,
        leakH        : 130,
        leakBlur     : 100,    // horizontal blur radius on leak solid
        leakBlur2    : 220,    // wider soft secondary streak
    };

    var CARDS = [
        { label:"Salary",     line1:"PREMIUM",    line2:"GLOBAL SALARY",       accent:[0.788, 0.659, 0.298] },
        { label:"Healthcare", line1:"WORLD-CLASS", line2:"HEALTHCARE",          accent:[0.298, 0.498, 0.788] },
        { label:"PR",         line1:"AUSTRALIAN",  line2:"PERMANENT RESIDENCY", accent:[0.176, 0.416, 0.310] }
    ];

    // ─────────────────────────────────────────────
    // MAIN
    // ─────────────────────────────────────────────
    app.beginUndoGroup("Beat2_v2");

    try {
        var GAP   = CFG.gapFrames / CFG.fps;
        var total = CARDS.length * CFG.cardDur + CARDS.length * GAP + CFG.outroDur;

        var cardComps = [];
        for (var i = 0; i < CARDS.length; i++) {
            cardComps.push(buildCard(CARDS[i]));
        }
        var outroComp = buildOutro();

        // Main comp
        var main = app.project.items.addComp(
            "Beat2_ThreePillars_v2_MAIN", CFG.W, CFG.H, 1, total, CFG.fps
        );
        main.motionBlur = true;

        var bgL = main.layers.addSolid(CFG.bg, "BG_Global", CFG.W, CFG.H, 1);
        bgL.moveToEnd();

        var t = 0;
        for (var j = 0; j < cardComps.length; j++) {
            var lyr = main.layers.add(cardComps[j]);
            lyr.startTime = t;
            t += CFG.cardDur + GAP;
        }
        var outroLyr = main.layers.add(outroComp);
        outroLyr.startTime = t;

        main.openInViewer();
        alert(
            "Beat2 v2 built.\n\nMain comp: Beat2_ThreePillars_v2_MAIN\n" +
            "Duration: " + total.toFixed(2) + "s\n\n" +
            "Font used: " + CFG.font + "\n" +
            "If missing: swap to Anton-Regular or Impact in each pre-comp."
        );

    } catch(err) {
        alert("Error: " + err.toString() + "\nLine: " + err.line);
    }

    app.endUndoGroup();


    // ═══════════════════════════════════════════════
    // BUILD CARD PRE-COMP
    // ═══════════════════════════════════════════════
    function buildCard(card) {
        var comp = app.project.items.addComp(
            "v2_Card_" + card.label, CFG.W, CFG.H, 1, CFG.cardDur, CFG.fps
        );
        comp.motionBlur = true;

        comp.layers.addSolid(CFG.bg, "BG", CFG.W, CFG.H, 1).moveToEnd();
        addVignette(comp);
        addLightLeak(comp, card.accent, CFG.cardDur);
        addImpactFlash(comp, card.accent, CFG.cardDur);
        addHeadline(comp, card.line1 + "\n" + card.line2, card.accent, 0);

        return comp;
    }


    // ─────────────────────────────────────────────
    // VIGNETTE  — elliptical inverted mask, heavy feather
    // ─────────────────────────────────────────────
    function addVignette(comp) {
        var vig = comp.layers.addSolid([0, 0, 0], "Vignette", CFG.W, CFG.H, 1);

        try {
            // Correct AE scripting API for adding masks
            var maskProp = vig.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
            maskProp.property("ADBE Mask Inverted").setValue(true);
            maskProp.property("ADBE Mask Feather").setValue([380, 380]);
            maskProp.property("ADBE Mask Opacity").setValue(75);

            var W = CFG.W, H = CFG.H;
            var kappa = 0.5523;
            var rx = W * 0.47, ry = H * 0.44;
            var cx = W / 2,    cy = H / 2;

            var shape         = new Shape();
            shape.vertices    = [[cx, cy-ry],  [cx+rx, cy],  [cx, cy+ry],  [cx-rx, cy]];
            shape.inTangents  = [[-rx*kappa,0], [0,-ry*kappa], [rx*kappa,0],  [0, ry*kappa]];
            shape.outTangents = [[rx*kappa,0],  [0, ry*kappa], [-rx*kappa,0], [0,-ry*kappa]];
            shape.closed      = true;

            maskProp.property("ADBE Mask Shape").setValue(shape);
        } catch(e) {
            // Fallback: simple dark overlay at low opacity
            vig.property("ADBE Transform Group").property("ADBE Opacity").setValue(28);
        }
    }


    // ─────────────────────────────────────────────
    // LIGHT LEAK
    // Two horizontal solids in ADD blend mode.
    // Fast Box Blur (horiz only) creates soft gradient
    // falloff so edges dissolve rather than hard-cut.
    // ─────────────────────────────────────────────
    function addLightLeak(comp, accent, dur) {
        var leakW = Math.round(CFG.W * 0.65);

        // ── Core streak ──
        var core = comp.layers.addSolid(accent, "Leak_Core", leakW, CFG.leakH, 1);
        core.blendingMode = BlendingMode.ADD;

        applyHorizBlur(core, CFG.leakBlur);

        var opCore = core.property("ADBE Transform Group").property("ADBE Opacity");
        opCore.setValueAtTime(0,        0);
        opCore.setValueAtTime(2/CFG.fps, CFG.leakOpacity);
        opCore.setValueAtTime(dur - 0.08, CFG.leakOpacity * 0.5);
        opCore.setValueAtTime(dur,       0);
        for (var k = 1; k <= opCore.numKeys; k++) {
            opCore.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
        }

        sweepX(core, leakW, CFG.H * 0.43, dur);

        // ── Wide soft halo ──
        var halo = comp.layers.addSolid(accent, "Leak_Halo", leakW, CFG.leakH * 3.5, 1);
        halo.blendingMode = BlendingMode.ADD;

        applyHorizBlur(halo, CFG.leakBlur2);

        var opHalo = halo.property("ADBE Transform Group").property("ADBE Opacity");
        opHalo.setValueAtTime(0,          0);
        opHalo.setValueAtTime(3/CFG.fps,  CFG.leakOpacity * 0.3);
        opHalo.setValueAtTime(dur,        CFG.leakOpacity * 0.15);
        for (var k = 1; k <= opHalo.numKeys; k++) {
            opHalo.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
        }

        sweepX(halo, leakW, CFG.H * 0.5, dur);
    }

    function applyHorizBlur(layer, radius) {
        try {
            var blur = layer.property("ADBE Effect Parade").addProperty("ADBE Fast Box Blur");
            blur.property("ADBE Fast Box Blur-0001").setValue(radius);
            blur.property("ADBE Fast Box Blur-0003").setValue(1);  // 1 = horizontal only
        } catch(e) { /* silent — AE may use different internal name */ }
    }

    function sweepX(layer, layerW, posY, dur) {
        var pp = layer.property("ADBE Transform Group").property("ADBE Position");
        pp.setValueAtTime(0,   [-(layerW * 0.5),     posY]);
        pp.setValueAtTime(dur, [CFG.W + layerW * 0.5, posY]);
        pp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
        pp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
    }


    // ─────────────────────────────────────────────
    // IMPACT FLASH  — accent color bloom on cut point
    // ─────────────────────────────────────────────
    function addImpactFlash(comp, accent, dur) {
        var flash = comp.layers.addSolid(accent, "ImpactFlash", CFG.W, CFG.H, 1);
        flash.blendingMode = BlendingMode.ADD;

        var op = flash.property("ADBE Transform Group").property("ADBE Opacity");
        op.setValueAtTime(0,          55);
        op.setValueAtTime(4/CFG.fps,  0);
        op.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
        op.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
    }


    // ─────────────────────────────────────────────
    // HEADLINE TEXT
    //
    // Scale spring:  150 → 97 → 103 → 100
    // Position slam: drops from -80px above, overshoots +12px, settles
    // Stroke:        accent color behind white fill
    // Drop Shadow:   depth / impact
    // Motion blur:   enabled
    // ─────────────────────────────────────────────
    function addHeadline(comp, text, accent, startOffset) {
        var tl = comp.layers.addText(text);
        tl.name = "Headline";
        tl.motionBlur = true;

        // ── Typography ──
        var srcProp = tl.property("ADBE Text Properties").property("ADBE Text Document");
        var doc     = srcProp.value;
        doc.font          = CFG.font;
        doc.fontSize      = CFG.fontSize;
        doc.justification = ParagraphJustification.CENTER_JUSTIFY;
        doc.fillColor     = [1, 1, 1];
        doc.applyStroke   = true;
        doc.strokeColor   = accent;
        doc.strokeWidth   = CFG.strokeWidth;
        doc.strokeOverFill = false;     // stroke behind fill = clean outline
        doc.tracking      = CFG.tracking;
        doc.leading       = CFG.fontSize * 0.92;
        srcProp.setValue(doc);

        var xfm = tl.property("ADBE Transform Group");

        // ── Drop Shadow ──
        try {
            var shadow = tl.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
            shadow.property(2).setValue(90);   // Opacity
            shadow.property(3).setValue(140);  // Direction (angle)
            shadow.property(4).setValue(14);   // Distance
            shadow.property(5).setValue(22);   // Softness
        } catch(e) {}

        var f  = CFG.fps;
        var cx = CFG.W / 2;
        var cy = CFG.H / 2;
        var s  = startOffset;

        // ── Position slam (Y): above → overshoot down → settle ──
        var posProp = xfm.property("ADBE Position");
        posProp.setValueAtTime(s + 0/f,  [cx, cy - 90]);
        posProp.setValueAtTime(s + 7/f,  [cx, cy + 14]);
        posProp.setValueAtTime(s + 13/f, [cx, cy]);

        for (var k = 1; k <= posProp.numKeys; k++) {
            posProp.setInterpolationTypeAtKey(k,
                KeyframeInterpolationType.BEZIER,
                KeyframeInterpolationType.BEZIER
            );
        }
        var pFast = new KeyframeEase(0, 85);
        var pSlow = new KeyframeEase(0, 33);
        // Position is a spatial property — temporal ease takes 1-element arrays
        posProp.setTemporalEaseAtKey(2, [pFast], [pSlow]);
        posProp.setTemporalEaseAtKey(3, [pFast], [pSlow]);

        // ── Scale spring: 150 → 97 → 103 → 100 ──
        var scaleProp = xfm.property("ADBE Scale");
        scaleProp.setValueAtTime(s + 0/f,  [150, 150]);
        scaleProp.setValueAtTime(s + 6/f,  [97,  97]);
        scaleProp.setValueAtTime(s + 10/f, [103, 103]);
        scaleProp.setValueAtTime(s + 14/f, [100, 100]);

        for (var k = 1; k <= scaleProp.numKeys; k++) {
            scaleProp.setInterpolationTypeAtKey(k,
                KeyframeInterpolationType.BEZIER,
                KeyframeInterpolationType.BEZIER
            );
        }
        var sH = new KeyframeEase(0, 85);
        var sS = new KeyframeEase(0, 33);
        // Key 2: hard decel into compressed state
        scaleProp.setTemporalEaseAtKey(2, [sH,sH,sH], [sS,sS,sS]);
        // Key 3: fast bounce back up
        scaleProp.setTemporalEaseAtKey(3, [sS,sS,sS], [sH,sH,sH]);
        // Key 4: settle
        scaleProp.setTemporalEaseAtKey(4, [sH,sH,sH], [sS,sS,sS]);

        return tl;
    }


    // ═══════════════════════════════════════════════
    // BUILD OUTRO PRE-COMP
    // ═══════════════════════════════════════════════
    function buildOutro() {
        var comp = app.project.items.addComp(
            "v2_Card_Outro", CFG.W, CFG.H, 1, CFG.outroDur, CFG.fps
        );
        comp.motionBlur = true;

        comp.layers.addSolid(CFG.bg, "BG", CFG.W, CFG.H, 1).moveToEnd();
        addVignette(comp);

        // All three leaks bleed in simultaneously across different Y bands
        for (var i = 0; i < CARDS.length; i++) {
            addOutroLeak(comp, CARDS[i].accent, i);
        }

        // Tri-color impact flash (all three accents blend together)
        for (var i = 0; i < CARDS.length; i++) {
            var flash = comp.layers.addSolid(CARDS[i].accent, "Flash_"+i, CFG.W, CFG.H, 1);
            flash.blendingMode = BlendingMode.ADD;
            var op = flash.property("ADBE Transform Group").property("ADBE Opacity");
            op.setValueAtTime(0,          22);
            op.setValueAtTime(5/CFG.fps,  0);
            op.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
            op.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
        }

        // Headline — gold stroke (premium wrap-up)
        addHeadline(comp, "FOR YOUR\nENTIRE FAMILY", CARDS[0].accent, 0);

        // Triptych rule reveal
        addTriptychRule(comp);

        return comp;
    }

    function addOutroLeak(comp, accent, idx) {
        var yPositions = [CFG.H * 0.22, CFG.H * 0.5, CFG.H * 0.78];
        var leakW = Math.round(CFG.W * 0.55);
        var leakH = CFG.leakH * 0.6;

        var lk = comp.layers.addSolid(accent, "Leak_"+idx, leakW, leakH, 1);
        lk.blendingMode = BlendingMode.ADD;
        applyHorizBlur(lk, 150);

        var opProp = lk.property("ADBE Transform Group").property("ADBE Opacity");
        opProp.setValueAtTime(0,               0);
        opProp.setValueAtTime(4/CFG.fps,       CFG.leakOpacity * 0.55);
        opProp.setValueAtTime(CFG.outroDur,    CFG.leakOpacity * 0.35);
        for (var k = 1; k <= opProp.numKeys; k++) {
            opProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
        }

        sweepX(lk, leakW, yPositions[idx], CFG.outroDur);
    }

    function addTriptychRule(comp) {
        var ruleY      = CFG.H / 2 + 135;
        var ruleH      = 5;
        var totalRuleW = 600;
        var segGap     = 12;
        var segW       = Math.round((totalRuleW - segGap * 2) / 3);
        var bleedStart = 14 / CFG.fps;   // after text settles
        var bleedDur   = 5  / CFG.fps;

        for (var i = 0; i < CARDS.length; i++) {
            var xPos = CFG.W / 2 + (i - 1) * (segW + segGap);
            var seg  = comp.layers.addSolid(CARDS[i].accent, "Rule_" + CARDS[i].label, segW, ruleH, 1);

            seg.property("ADBE Transform Group")
               .property("ADBE Position")
               .setValue([xPos, ruleY]);

            var offset    = (i * 2) / CFG.fps;   // 2-frame stagger
            var scaleProp = seg.property("ADBE Transform Group").property("ADBE Scale");

            scaleProp.setValueAtTime(bleedStart + offset,             [0,   100]);
            scaleProp.setValueAtTime(bleedStart + offset + bleedDur,  [100, 100]);

            for (var k = 1; k <= scaleProp.numKeys; k++) {
                scaleProp.setInterpolationTypeAtKey(k,
                    KeyframeInterpolationType.BEZIER,
                    KeyframeInterpolationType.BEZIER
                );
            }
            var eIn  = new KeyframeEase(0, 0.1);
            var eOut = new KeyframeEase(0, 85);
            scaleProp.setTemporalEaseAtKey(1, [eIn,  eIn,  eIn],  [eOut, eOut, eOut]);
            scaleProp.setTemporalEaseAtKey(2, [eOut, eOut, eOut], [eIn,  eIn,  eIn]);
        }
    }

})();
