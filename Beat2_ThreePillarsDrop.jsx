/**
 * Beat 2 — The Three Pillars Drop
 * After Effects ExtendScript
 *
 * Builds three card pre-comps + outro, assembles into main comp.
 * Run via AE: File > Scripts > Run Script File...
 *
 * Requires: After Effects CC 2019+
 * Recommended font: Inter Tight Black  (fallback: Arial Bold)
 */

(function Beat2_ThreePillarsDrop() {

    // ─────────────────────────────────────────────
    // CONFIG
    // ─────────────────────────────────────────────
    var CFG = {
        fps       : 24,
        W         : 1920,
        H         : 1080,
        bg        : [0.039, 0.039, 0.039],   // #0A0A0A

        cardDur   : 1.5,    // seconds each card stays on screen
        outroDur  : 2.5,    // seconds for "for your entire family"
        stampFrames: 10,    // scale 130→100% duration in frames
        gapFrames : 1,      // black frames between cards

        font      : "InterTight-Black",      // change if not installed
        fontFallback: "Arial-BoldMT",
        fontSize  : 118,
        tracking  : 90,                      // wide-track — AE units (1/1000 em)

        leakOpacity  : 45,   // 0-100
        leakHeight   : 100,  // px, thin horizontal streak
        leakWidthPct : 0.55  // fraction of comp width
    };

    // Card definitions
    var CARDS = [
        {
            label  : "Salary",
            line1  : "PREMIUM",
            line2  : "GLOBAL SALARY",
            accent : [0.788, 0.659, 0.298]   // #C9A84C  gold
        },
        {
            label  : "Healthcare",
            line1  : "WORLD-CLASS",
            line2  : "HEALTHCARE",
            accent : [0.298, 0.498, 0.788]   // #4C7FC9  cool blue
        },
        {
            label  : "PR",
            line1  : "AUSTRALIAN",
            line2  : "PERMANENT RESIDENCY",
            accent : [0.176, 0.416, 0.310]   // #2D6A4F  deep green
        }
    ];

    // ─────────────────────────────────────────────
    // MAIN
    // ─────────────────────────────────────────────
    app.beginUndoGroup("Beat2_ThreePillarsDrop");

    try {
        var GAP    = CFG.gapFrames / CFG.fps;
        var total  = CARDS.length * CFG.cardDur
                   + (CARDS.length) * GAP          // gap after each card + before outro
                   + CFG.outroDur;

        // Build card pre-comps
        var cardComps = [];
        for (var i = 0; i < CARDS.length; i++) {
            cardComps.push(buildCardComp(CARDS[i]));
        }

        // Build outro pre-comp
        var outroComp = buildOutroComp();

        // Assemble main comp
        var main = app.project.items.addComp(
            "Beat2_ThreePillars_MAIN", CFG.W, CFG.H, 1, total, CFG.fps
        );

        // Global black BG
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
            "Three Pillars Drop built.\n\n" +
            "Main comp: Beat2_ThreePillars_MAIN\n" +
            "Total duration: " + total.toFixed(2) + "s\n\n" +
            "Tip: Replace font '" + CFG.font + "' in each\npre-comp if it shows as Missing."
        );

    } catch (err) {
        alert("Script error:\n" + err.toString() + "\nLine: " + err.line);
    }

    app.endUndoGroup();


    // ═══════════════════════════════════════════════
    // BUILD CARD PRE-COMP
    // ═══════════════════════════════════════════════
    function buildCardComp(card) {
        var comp = app.project.items.addComp(
            "Card_" + card.label,
            CFG.W, CFG.H, 1,
            CFG.cardDur, CFG.fps
        );

        // BG
        var bg = comp.layers.addSolid(CFG.bg, "BG", CFG.W, CFG.H, 1);
        bg.moveToEnd();

        // Light leak — horizontal streak sweeping left→right
        addLightLeak(comp, card.accent);

        // Stamp headline text
        addHeadlineText(comp, card.line1 + "\n" + card.line2);

        return comp;
    }


    // ───────────────────────────────────────────────
    // LIGHT LEAK
    // A solid in ADD blend mode that sweeps across X.
    // Dark-to-light wash effect.
    // ───────────────────────────────────────────────
    function addLightLeak(comp, accent) {
        var leakW = Math.round(CFG.W * CFG.leakWidthPct);

        var lk = comp.layers.addSolid(
            accent,
            "LightLeak",
            leakW,
            CFG.leakHeight,
            1
        );

        lk.blendingMode = BlendingMode.ADD;

        // Opacity: fade up fast, hold, fade off near end
        var opProp = lk.property("ADBE Transform Group").property("ADBE Opacity");
        opProp.setValueAtTime(0,               0);
        opProp.setValueAtTime(2 / CFG.fps,     CFG.leakOpacity);
        opProp.setValueAtTime(CFG.cardDur - 0.1, CFG.leakOpacity * 0.6);
        opProp.setValueAtTime(CFG.cardDur,       0);

        for (var k = 1; k <= opProp.numKeys; k++) {
            opProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
        }

        // Position: sweep from left edge to right edge over full card duration
        // Y is centered vertically (slightly above center for cinematic feel)
        var posX_start  = -(leakW * 0.5);
        var posX_end    = CFG.W + leakW * 0.5;
        var posY        = CFG.H * 0.46;

        var posProp = lk.property("ADBE Transform Group").property("ADBE Position");
        posProp.setValueAtTime(0,            [posX_start, posY]);
        posProp.setValueAtTime(CFG.cardDur,  [posX_end,   posY]);

        posProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
        posProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
    }


    // ───────────────────────────────────────────────
    // HEADLINE TEXT  — stamp scale 130→100%, ease-out
    // ───────────────────────────────────────────────
    function addHeadlineText(comp, textString) {
        var tl = comp.layers.addText(textString);
        tl.name = "Headline";

        // Text document
        var srcProp = tl.property("ADBE Text Properties")
                        .property("ADBE Text Document");
        var doc = srcProp.value;

        // Try preferred font; AE will warn if missing — not a script error
        doc.font             = CFG.font;
        doc.fontSize         = CFG.fontSize;
        doc.justification    = ParagraphJustification.CENTER_JUSTIFY;
        doc.fillColor        = [1, 1, 1];
        doc.strokeOverFill   = false;
        doc.applyStroke      = false;
        doc.tracking         = CFG.tracking;
        doc.leading          = CFG.fontSize * 1.1;
        srcProp.setValue(doc);

        // Center in comp via Position
        tl.property("ADBE Transform Group")
          .property("ADBE Position")
          .setValue([CFG.W / 2, CFG.H / 2]);

        // Anchor to layer center for correct scale pivot
        tl.property("ADBE Transform Group")
          .property("ADBE Anchor Point")
          .setValue([0, 0]);

        // ── Scale: stamp 130 → 100 in stampFrames, then hold ──
        var stampDur = CFG.stampFrames / CFG.fps;
        var scaleProp = tl.property("ADBE Transform Group")
                          .property("ADBE Scale");

        scaleProp.setValueAtTime(0,         [130, 130]);
        scaleProp.setValueAtTime(stampDur,  [100, 100]);

        // Key 1: linear (hard launch)
        scaleProp.setInterpolationTypeAtKey(
            1,
            KeyframeInterpolationType.LINEAR,
            KeyframeInterpolationType.LINEAR
        );

        // Key 2: ease-out (decelerates into final position, "stamped")
        scaleProp.setInterpolationTypeAtKey(
            2,
            KeyframeInterpolationType.BEZIER,
            KeyframeInterpolationType.BEZIER
        );
        var easeHeavy = new KeyframeEase(0, 85);   // heavy ease-in on arrival
        var easeLeave = new KeyframeEase(0, 33);
        // Scale is 3D internally — must pass 3 KeyframeEase elements
        scaleProp.setTemporalEaseAtKey(2, [easeHeavy, easeHeavy, easeHeavy], [easeLeave, easeLeave, easeLeave]);

        return tl;
    }


    // ═══════════════════════════════════════════════
    // BUILD OUTRO PRE-COMP
    // "for your entire family" + triptych rule bleed
    // ═══════════════════════════════════════════════
    function buildOutroComp() {
        var comp = app.project.items.addComp(
            "Card_Outro",
            CFG.W, CFG.H, 1,
            CFG.outroDur, CFG.fps
        );

        // BG
        var bg = comp.layers.addSolid(CFG.bg, "BG", CFG.W, CFG.H, 1);
        bg.moveToEnd();

        // All three light leaks bleed in simultaneously
        for (var i = 0; i < CARDS.length; i++) {
            addOutroLeak(comp, CARDS[i].accent, i);
        }

        // Main text
        var tl = comp.layers.addText("FOR YOUR\nENTIRE FAMILY");
        tl.name = "OutroHeadline";

        var srcProp = tl.property("ADBE Text Properties")
                        .property("ADBE Text Document");
        var doc = srcProp.value;
        doc.font           = CFG.font;
        doc.fontSize       = CFG.fontSize * 0.9;
        doc.justification  = ParagraphJustification.CENTER_JUSTIFY;
        doc.fillColor      = [1, 1, 1];
        doc.applyStroke    = false;
        doc.tracking       = CFG.tracking;
        doc.leading        = CFG.fontSize * 1.05;
        srcProp.setValue(doc);

        tl.property("ADBE Transform Group")
          .property("ADBE Position")
          .setValue([CFG.W / 2, CFG.H / 2 - 50]);

        tl.property("ADBE Transform Group")
          .property("ADBE Anchor Point")
          .setValue([0, 0]);

        // Stamp scale
        var stampDur = CFG.stampFrames / CFG.fps;
        var scaleProp = tl.property("ADBE Transform Group")
                          .property("ADBE Scale");
        scaleProp.setValueAtTime(0,        [130, 130]);
        scaleProp.setValueAtTime(stampDur, [100, 100]);

        scaleProp.setInterpolationTypeAtKey(
            1, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR
        );
        scaleProp.setInterpolationTypeAtKey(
            2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER
        );
        var easeH = new KeyframeEase(0, 85);
        var easeL = new KeyframeEase(0, 33);
        scaleProp.setTemporalEaseAtKey(2, [easeH, easeH, easeH], [easeL, easeL, easeL]);

        // Triptych rule beneath text
        addTriptychRule(comp);

        return comp;
    }


    // ───────────────────────────────────────────────
    // OUTRO LEAK — three accent leaks bleeding in
    // simultaneously, staggered slightly in Y
    // ───────────────────────────────────────────────
    function addOutroLeak(comp, accent, idx) {
        var leakW = Math.round(CFG.W * 0.35);
        var yPositions = [CFG.H * 0.30, CFG.H * 0.50, CFG.H * 0.70];

        var lk = comp.layers.addSolid(
            accent,
            "Leak_" + idx,
            leakW, CFG.leakHeight * 0.6, 1
        );
        lk.blendingMode = BlendingMode.ADD;

        // All three bleed in starting at frame 0
        var opProp = lk.property("ADBE Transform Group")
                       .property("ADBE Opacity");
        opProp.setValueAtTime(0,               0);
        opProp.setValueAtTime(3 / CFG.fps,     CFG.leakOpacity * 0.7);
        opProp.setValueAtTime(CFG.outroDur,    CFG.leakOpacity * 0.5);

        for (var k = 1; k <= opProp.numKeys; k++) {
            opProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
        }

        // Subtle drift
        var posProp = lk.property("ADBE Transform Group")
                        .property("ADBE Position");
        posProp.setValueAtTime(0,             [CFG.W * 0.1,  yPositions[idx]]);
        posProp.setValueAtTime(CFG.outroDur,  [CFG.W * 0.9, yPositions[idx]]);

        posProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
        posProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
    }


    // ───────────────────────────────────────────────
    // TRIPTYCH RULE
    // Three thin colored segments beneath unified text
    // ───────────────────────────────────────────────
    function addTriptychRule(comp) {
        var ruleY     = CFG.H / 2 + 120;
        var ruleH     = 4;
        var totalRuleW = 540;
        var segGap    = 10;
        var segW      = Math.round((totalRuleW - segGap * 2) / 3);

        // Bleed-in starts right after text stamp lands
        var bleedStart = (CFG.stampFrames + 1) / CFG.fps;
        var bleedDur   = 6 / CFG.fps;

        for (var i = 0; i < CARDS.length; i++) {
            // X offset: left, center, right segment
            var xPos = CFG.W / 2 + (i - 1) * (segW + segGap);

            var seg = comp.layers.addSolid(
                CARDS[i].accent,
                "Rule_" + CARDS[i].label,
                segW, ruleH, 1
            );

            seg.property("ADBE Transform Group")
               .property("ADBE Position")
               .setValue([xPos, ruleY]);

            // Scale in from 0% width — scale X: 0→100
            var scaleProp = seg.property("ADBE Transform Group")
                               .property("ADBE Scale");
            scaleProp.setValueAtTime(bleedStart,            [0, 100]);
            scaleProp.setValueAtTime(bleedStart + bleedDur, [100, 100]);

            // Stagger each segment by 2 frames
            var offset = (i * 2) / CFG.fps;
            scaleProp.setValueAtTime(bleedStart + offset,            [0, 100]);
            scaleProp.setValueAtTime(bleedStart + offset + bleedDur, [100, 100]);

            for (var k = 1; k <= scaleProp.numKeys; k++) {
                scaleProp.setInterpolationTypeAtKey(
                    k,
                    KeyframeInterpolationType.BEZIER,
                    KeyframeInterpolationType.BEZIER
                );
            }

            var easeIn  = new KeyframeEase(0, 0.1);
            var easeOut = new KeyframeEase(0, 85);
            scaleProp.setTemporalEaseAtKey(scaleProp.numKeys - 1, [easeIn,  easeIn,  easeIn],  [easeOut, easeOut, easeOut]);
            scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,     [easeOut, easeOut, easeOut], [easeIn,  easeIn,  easeIn]);
        }
    }

})();
