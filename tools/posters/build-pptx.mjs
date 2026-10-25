import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = fileURLToPath(new URL("../../", import.meta.url));
const SKILL_DIR = "/Users/kxue971student.fuhsd.org/.codex/plugins/cache/openai-primary-runtime/presentations/26.1024.11018/skills/presentations";
const RUNTIME_PYTHON = "/Users/kxue971student.fuhsd.org/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const TMP_DIR = path.join(workspaceDir, "archive/poster-build/pptx");
const FINAL_PPTX = path.join(workspaceDir, "posters/exports/pptx/ExoPlain_AIAS_2026_Editable_A0_Poster.pptx");
await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

const { resolvePresentationFont, finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href);
const font = resolvePresentationFont({ fontFamily: "Arial" });
const W = 3178.5827, H = 4493.8583;
const C = { navy: "#0A2C46", navy2: "#123C59", teal: "#009BB5", cyan: "#16BFD0", ice: "#EAF5F8", ink: "#122B3D", muted: "#486273", line: "#BDD6DE", gold: "#D88A18", white: "#FFFFFF" };
const deck = Presentation.create({ slideSize: { width: W, height: H } });
const slide = deck.slides.add();
slide.background.fill = C.white;

function box(x,y,w,h,fill=C.white,line=C.line,lw=2) {
  return slide.shapes.add({ geometry:"rect", position:{left:x,top:y,width:w,height:h}, fill, line:{style:"solid",fill:line,width:lw} });
}
function text(txt,x,y,w,h,size=24,color=C.ink,bold=false,align="left") {
  const s=slide.shapes.add({ geometry:"textbox", position:{left:x,top:y,width:w,height:h}, fill:"none", line:{fill:"none",width:0} });
  s.text=txt;
  s.text.style={ typeface:font, fontSize:size, color, bold, autoFit:"shrinkText", horizontalAlignment:align, verticalAlignment:"middle" };
  return s;
}
function header(n,title,x,y,w) {
  box(x,y,w,78,C.navy,C.navy,0);
  text(String(n).padStart(2,"0"),x+18,y+10,60,58,28,C.cyan,true);
  text(title,x+82,y+8,w-100,62,30,C.white,true);
}
function bullet(txt,x,y,w,h,size=20) { return text("• " + txt,x,y,w,h,size,C.ink,false); }
async function img(rel,x,y,w,h,alt) {
  const p=path.join(workspaceDir,rel); const b=await fs.readFile(p);
  slide.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:"image/jpeg",alt,fit:"cover",position:{left:x,top:y,width:w,height:h}});
}

box(0,0,W,28,C.teal,C.teal,0);
text("PLANET PIONEERS · AIAS+ 2026 STUDENT SHOWCASE",75,70,2050,55,27,C.teal,true);
text("ExoPlain: An Interactive, Explainable AI Platform\nfor Exoplanet Discovery",75,125,2540,210,72,C.navy,true);
text("From TESS light curves and candidate parameters to interpretable evidence for human review",75,340,2500,70,34,C.teal,true);
box(75,420,2525,95,C.ice,C.ice,0);
text("Planet Pioneers · Student research team · NASA Space Apps Challenge 2025\nAuthors: [student names] · School: [school] · Mentor: [mentor]",92,430,2470,74,23,C.ink,false);
text("EXO\nPLAIN",2700,75,390,170,52,C.navy,true,"right");
text("AI FOR SCIENCE\nINTERACTIVE ML",2700,250,390,70,22,C.teal,true,"right");

const iy=555, ih=600, iw=740, gap=18;
await img("archive/education-prototype/public/transit-method-diagram-showing-planet-passing-in-f.jpg",75,iy,iw,ih,"Transit geometry diagram");
await img("archive/education-prototype/public/exoplanet-light-curve-graph-showing-brightness-dip.jpg",75+iw+gap,iy,iw,ih,"Exoplanet light curve");
await img("archive/education-prototype/public/signal-to-noise-ratio-comparison-in-transit-data.jpg",75+2*(iw+gap),iy,iw,ih,"Signal-to-noise comparison");
await img("archive/education-prototype/public/3d-planet-exploration-interface.jpg",75+3*(iw+gap),iy,740,ih,"Interactive planet interface");
const caps=["Transit geometry","Light-curve evidence","Signal quality","Interactive exploration"];
for(let i=0;i<4;i++){box(75+i*(iw+gap),iy+ih-68,iw,68,C.navy,C.navy,0);text(caps[i],90+i*(iw+gap),iy+ih-60,iw-30,50,21,C.white,true);}

const L=75, G=28, LW=1640, RW=W-150-G-LW, RX=L+LW+G;
let y=1185;
header(1,"Research problem and contribution",L,y,LW); y+=78; box(L,y,LW,275,C.white,C.line,2);
text("Transit surveys produce large time-series datasets, but a brightness dip alone does not confirm a planet. Stellar variability, eclipsing binaries, instrumental noise and processing artifacts can create similar signatures. ExoPlain connects candidate measurements, FITS processing, experimental classifiers and a language-model explanation layer so learners can trace how an input becomes an assessment.",L+24,y+18,LW-48,130,22,C.ink,false);
box(L+24,y+165,LW-48,86,C.ice,C.teal,2); text("Research question: How can an interactive AI system make exoplanet evidence easier to interpret while preserving uncertainty and the distinction between screening and confirmation?",L+40,y+173,LW-80,70,21,C.navy,true);
y+=303;
header(2,"End-to-end analysis pipeline",L,y,LW); y+=78; box(L,y,LW,450,C.white,C.line,2);
const steps=[
  ["1 · Acquire","Upload FITS or enter 16 orbital, transit, stellar and position fields."],
  ["2 · Clean","Select TIME/flux columns, remove invalid rows and median-normalize."],
  ["3 · Represent","Interpolate to 2,048 points and compute 37 engineered features."],
  ["4 · Classify","Scale features, run Random Forest and compare sequence models."],
  ["5 · Explain","Send labeled evidence to Gemini for a readable assessment."]
];
const sw=(LW-72)/5;
for(let i=0;i<5;i++){const sx=L+18+i*(sw+9);box(sx,y+22,sw,220,C.ice,C.teal,2);box(sx,y+22,sw,10,C.teal,C.teal,0);text(steps[i][0],sx+12,y+44,sw-24,50,22,C.teal,true);text(steps[i][1],sx+12,y+95,sw-24,125,18,C.ink,false);}
box(L+18,y+262,LW-36,150,"#FFF6E7",C.gold,2); text("Current architecture has two paths. Manual candidate entry calls Gemini directly. FITS upload calls the Python feature service and Random Forest. The production goal is one auditable pipeline in which the classifier supplies evidence and the language model explains it.",L+38,y+278,LW-76,120,20,C.ink,true);
y+=478;
header(3,"Data preparation and modeling methods",L,y,LW); y+=78; box(L,y,LW,1480,C.white,C.line,2);
const methods=[
  ["A · Labels and dataset","Training scripts use TESS light curves and TFOPWG dispositions. CP/KP/PC map to positive; FP/Unknown map to negative. Documentation reports 7,638 curves and strong class imbalance. Provenance and target grouping require audit."],
  ["B · Signal preprocessing","The FITS service finds common time and flux columns, removes NaN/Inf samples, requires at least 100 valid points, normalizes by median flux and linearly interpolates every curve to 2,048 points."],
  ["C · Random Forest","The feature path standardizes 37 engineered variables and trains class-balanced trees with a stratified 80/20 split. The model stores feature importance and AUC metadata."],
  ["D · Sequence models","The 1D CNN uses five convolution blocks: 64, 128, 256, 512 and 512 channels. LSTM downsamples to 256 timesteps with 32 hidden units. An MLP provides a dense baseline."],
  ["E · Training controls","Seed 42, Adam with learning rate 10⁻³, weight decay 10⁻⁴, ReduceLROnPlateau, early stopping, gradient clipping, dropout and augmentation."],
  ["F · Transit physics","Inputs include period, epoch, impact parameter, duration, depth, radius, temperature, insolation, SNR, stellar properties, magnitude and sky position. Transit depth δ ≈ (Rₚ/R★)²."]
];
for(let i=0;i<6;i++){const col=i%2,row=Math.floor(i/2),mx=L+20+col*(LW/2-2),my=y+22+row*250,mw=LW/2-32;box(mx,my,mw,230,C.ice,C.teal,2);text(methods[i][0],mx+14,my+10,mw-28,42,23,C.navy,true);text(methods[i][1],mx+14,my+55,mw-28,158,18,C.ink,false);}
box(L+20,y+790,LW-40,150,C.navy,C.navy,0);text("37-feature vector",L+38,y+802,260,40,22,C.cyan,true);text("Distribution statistics · dip/peak counts at 1σ-3σ · three depth proxies · variance/RMSE · skewness/kurtosis · dominant frequency and band powers · rolling statistics · trend/R² · autocorrelation at lags 1/5/10 · periodicity strength",L+38,y+846,LW-76,80,18,C.white,false);
const modelRows=[
  ["Random Forest","37 scaled features","Primary FITS classifier","Leakage or duplicate targets"],
  ["1D CNN","Raw 2,048-point sequence","Local transit morphology","Class imbalance"],
  ["LSTM","256-step pooled sequence","Longer temporal context","Short events lost in pooling"],
  ["MLP","Flattened 2,048 points","Dense baseline","High parameter count"]
];
const tx=L+20, ty=y+970, tw=LW-40, rh=92, cw=[280,390,460,470];
let cx=tx; for(let i=0;i<4;i++){box(cx,ty,cw[i],62,C.navy,C.navy,0);text(["Model","Representation","Purpose","Main risk"][i],cx+10,ty+6,cw[i]-20,50,19,C.white,true);cx+=cw[i];}
for(let r=0;r<4;r++){cx=tx;for(let c=0;c<4;c++){box(cx,ty+62+r*rh,cw[c],rh,r%2?C.ice:C.white,C.line,1);text(modelRows[r][c],cx+10,ty+69+r*rh,cw[c]-20,rh-14,17,C.ink,c===0);cx+=cw[c];}}

let ry=1185;
header(4,"System architecture and data contracts",RX,ry,RW);ry+=78;box(RX,ry,RW,500,C.white,C.line,2);
const arch=[
  ["Next.js / TypeScript client","Manual form, FITS upload, 3D exploration and results interface."],
  ["Next.js API routes","Format measurements and call Gemini 2.5 Pro."],
  ["Python / Flask service","Parse FITS, normalize, resample, extract features and run RF."],
  ["Model artifacts","Serialized RF/scaler plus CNN, LSTM and MLP checkpoints."]
];
for(let i=0;i<4;i++){const c=i%2,r=Math.floor(i/2),ax=RX+18+c*(RW/2),ay=ry+20+r*160;box(ax,ay,RW/2-27,142,C.ice,C.teal,2);text(arch[i][0],ax+12,ay+8,RW/2-51,40,19,C.navy,true);text(arch[i][1],ax+12,ay+50,RW/2-51,78,16,C.ink,false);}
const contract=["INPUT\nFITS or 16 fields","MODEL EVIDENCE\n37 features + probability","OUTPUT\nassessment + rationale"];
for(let i=0;i<3;i++){const cw2=(RW-48)/3;box(RX+18+i*(cw2+6),ry+360,cw2,110,C.teal,C.teal,0);text(contract[i],RX+28+i*(cw2+6),ry+368,cw2-20,94,17,C.white,true,"center");}
ry+=528;
header(5,"Explainability design and safeguards",RX,ry,RW);ry+=78;box(RX,ry,RW,610,C.white,C.line,2);
const exp=[
  ["Evidence selection","Manual entry sends submitted measurements. FITS analysis sends labeled features and Random Forest probability."],
  ["Structured generation","Gemini returns a Boolean assessment and five important features with relevance descriptions."],
  ["Readable result","Users connect the assessment to transit depth, periodicity, stellar context and signal quality."],
  ["Intended role","The explanation supports learning and candidate triage, not scientific confirmation."]
];
for(let i=0;i<4;i++){const c=i%2,r=Math.floor(i/2),ex=RX+18+c*(RW/2),ey=ry+18+r*170;box(ex,ey,RW/2-27,152,C.ice,C.line,1);text(exp[i][0],ex+12,ey+8,RW/2-51,38,19,C.teal,true);text(exp[i][1],ex+12,ey+48,RW/2-51,90,16,C.ink,false);}
box(RX+18,ry+370,RW-36,205,"#FFF3DF",C.gold,2);text("Known implementation gaps",RX+34,ry+383,RW-68,38,20,"#69450D",true);text("The manual Gemini route maps answers to fixed 85%/15% confidence and defaults missing answers toward true. The upload route can return randomized fallback features when the Python service fails. Both behaviors must be removed or visibly labeled before scientific use.",RX+34,ry+425,RW-68,130,18,"#69450D",false);
ry+=638;
header(6,"Current evidence and reproducibility status",RX,ry,RW);ry+=78;box(RX,ry,RW,720,C.white,C.line,2);
const ev=[
  ["Interactive system","Manual input, FITS upload, results and 3D exploration","Implemented"],
  ["FITS feature pipeline","Cleaning, normalization, interpolation and 37 features","Implemented"],
  ["Model experiments","RF, CNN, LSTM and MLP code with checkpoints","Implemented"],
  ["Training scale","README reports 7,638 TESS curves and 95.4% positives","Needs audit"],
  ["Performance","CNN loss and RF AUC reported in repository","Not reproduced"],
  ["Complete-system accuracy","No grouped held-out test or calibration analysis","Not established"]
];
const ew=[300,590,360], ex0=RX+18, ey0=ry+18;
let exx=ex0;for(let i=0;i<3;i++){box(exx,ey0,ew[i],62,C.navy,C.navy,0);text(["Artifact","Repository evidence","Status"][i],exx+10,ey0+6,ew[i]-20,50,18,C.white,true);exx+=ew[i];}
for(let r=0;r<6;r++){exx=ex0;for(let c=0;c<3;c++){box(exx,ey0+62+r*95,ew[c],95,r%2?C.ice:C.white,C.line,1);text(ev[r][c],exx+10,ey0+70+r*95,ew[c]-20,78,16,c===2?(r<3?C.teal:C.gold):C.ink,c===2);exx+=ew[c];}}
ry+=748;
header(7,"Validation plan and technical milestones",RX,ry,RW);ry+=78;box(RX,ry,RW,825,C.white,C.line,2);
const plan=[
  ["1 · Dataset audit","Record TIC IDs, sectors, label source and dates. Resolve Unknown labels and duplicates."],
  ["2 · Leakage-safe split","Group observations by star so repeat sectors cannot enter both train and test."],
  ["3 · Baselines and ablations","Compare every model with simple rules and remove feature families one at a time."],
  ["4 · Calibration","Report reliability curves, Brier score and threshold tradeoffs."],
  ["5 · External validation","Test on a later sector or independently curated candidate set."],
  ["6 · Explanation study","Measure whether students identify evidence, uncertainty and follow-up needs."]
];
for(let i=0;i<6;i++){const c=i%2,r=Math.floor(i/2),px=RX+18+c*(RW/2),py=ry+18+r*110;box(px,py,RW/2-27,98,C.ice,C.line,1);text(plan[i][0],px+12,py+5,RW/2-51,30,17,C.navy,true);text(plan[i][1],px+12,py+35,RW/2-51,55,14,C.ink,false);}
box(RX+18,ry+360,RW-36,90,C.navy,C.navy,0);text("Required reporting",RX+34,ry+368,220,30,18,C.cyan,true);text("ROC-AUC and PR-AUC · precision, recall and F1 · confusion matrix · calibration and Brier score · latency · failure examples",RX+34,ry+398,RW-68,42,15,C.white,false);
text("Failure modes to isolate",RX+18,ry+468,RW-36,34,19,C.teal,true);
const fails=["Eclipsing binaries","Stellar variability","Instrument artifacts","Low-SNR transits","Distribution shift","Missing metadata"];
for(let i=0;i<6;i++){const c=i%3,r=Math.floor(i/3),fw=(RW-48)/3,fx=RX+18+c*(fw+6),fy=ry+510+r*82;box(fx,fy,fw,70,C.ice,C.teal,1);text(fails[i],fx+8,fy+5,fw-16,60,14,C.navy,true,"center");}
box(RX+18,ry+690,RW-36,110,"#FFF7E9",C.gold,2);text("Final system rule",RX+34,ry+698,RW-68,28,18,"#69450D",true);text("Present outputs as candidate-screening evidence, publish calibrated uncertainty, disclose fallbacks and require human review before confirmation.",RX+34,ry+728,RW-68,60,15,"#69450D",false);

box(0,H-210,W,6,C.teal,C.teal,0);
text("TAKE-HOME MESSAGE",75,H-182,430,36,22,C.teal,true);
text("ExoPlain connects raw exoplanet evidence, machine-learning predictions and readable explanations in one learning workflow. The next priority is rigorous validation, calibrated uncertainty and removal of simulated fallbacks.",75,H-140,1270,110,22,C.navy,true);
text("Project sources: ExoPlain Next.js routes; web_fits_feature_server.py; random_forest_exoplanet_model.py; cnn1d_exoplanet_model.py; lstm_exoplanet_model.py; train_python_model.py; repository README. Scientific context: NASA Exoplanet Archive, TESS and TFOPWG dispositions. Repository-reported model values have not been independently reproduced.",1410,H-168,1690,120,13,C.muted,false);
slide.speakerNotes.text = "ExoPlain technical poster. All text boxes, section headers, process blocks and tables are editable. Images come from the project assets. Reported model values originate in the project repository and require independent reproduction.";

const candidatePath=path.join(TMP_DIR,"candidate-a0-poster.pptx");
await (await PresentationFile.exportPptx(deck)).save(candidatePath);
for (const [i,s] of deck.slides.items.entries()) {
  const png=await deck.export({slide:s,format:"png",scale:0.32});
  await fs.writeFile(path.join(TMP_DIR,`a0-slide-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));
}
await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath:FINAL_PPTX,
  pythonExecutable:RUNTIME_PYTHON,
  integrityValidatorPath:path.join(SKILL_DIR,"container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath:path.join(SKILL_DIR,"container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs:["--expected-slide-size-emu","30276000,42804000","--validate-heading-fit"],
  explicitTotalSlideCount:1,
  requiredNativeTableOwnerSlides:[],
  requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:"design",families:[font]},
  verifyArtifactToolImport:false,
  receiptPath:path.join(TMP_DIR,"a0-poster.validation.json")
});
