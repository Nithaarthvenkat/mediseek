// ════════════ HOSPITAL DATA ════════════
// Hospital data loaded from hospitals.json
let HOSPITALS = [];
fetch('/js/hospitals.json')
  .then(r => r.json())
  .then(data => {
    HOSPITALS = data.sort((a,b) => b.score - a.score);
    if(document.getElementById('page-dashboard').classList.contains('active')){
      renderHome(); renderFull(); popCmpSelects(); renderAnalytics();
    }
  });

HOSPITALS.sort((a,b)=>b.score-a.score);

// ════════════ EXPANDED SYMPTOM DATABASE — ALL WITH specialtyOnly ════════════
const SYMPTOM_DB = [
  // CARDIOLOGY
  {keys:["chest pain","chest tightness","heart pain","angina","left arm pain with chest"],spec:"Cardiology",dept:"Cardiology",severity:4,specialtyOnly:true,advice:"Get to a hospital immediately. Sit down, stay calm, and have someone drive you quickly."},
  {keys:["palpitation","heart pounding","irregular heartbeat","heart racing","heart flutter"],spec:"Cardiology",dept:"Cardiology",severity:3,specialtyOnly:true,advice:"Head to a doctor today. Sit quietly, avoid caffeine. Don't drive yourself if you feel unwell."},
  {keys:["shortness of breath","breathlessness","difficulty breathing","dyspnea"],spec:"Cardiology / Pulmonology",dept:"Cardiology",severity:3,specialtyOnly:true,advice:"See a doctor today. Sit upright, breathe slowly. Go to the nearest hospital if it gets worse."},
  {keys:["high blood pressure","hypertension","bp high","blood pressure"],spec:"Cardiology",dept:"Cardiology",severity:2,specialtyOnly:true,advice:"See a doctor within a couple of days. Reduce salt intake, rest, and try to stay calm."},
  {keys:["low blood pressure","hypotension","bp low","feeling faint","dizziness on standing"],spec:"Cardiology",dept:"Cardiology",severity:2,specialtyOnly:true,advice:"Lie down and drink water. If this keeps happening, see a doctor within the week."},
  {keys:["swollen legs","leg swelling","ankle swelling","edema"],spec:"Cardiology / Nephrology",dept:"Cardiology",severity:2,specialtyOnly:true,advice:"Elevate your legs and see a doctor within 2–3 days. Could be heart or kidney related."},

  // NEUROLOGY
  {keys:["stroke","facial drooping","slurred speech","sudden weakness","arm weakness","sudden numbness"],spec:"Neurology",dept:"Neurology",severity:4,specialtyOnly:true,advice:"Get to a hospital now. Face drooping, arm weakness, or slurred speech need immediate attention."},
  {keys:["seizure","fits","convulsion","epilepsy attack"],spec:"Neurology",dept:"Neurology",severity:4,specialtyOnly:true,advice:"Head to the nearest hospital right away. Note how long the episode lasted."},
  {keys:["severe headache","worst headache of my life","thunderclap headache","sudden headache"],spec:"Neurology",dept:"Neurology",severity:4,specialtyOnly:true,advice:"A sudden severe headache that came on instantly needs to be checked at a hospital today."},
  {keys:["headache","migraine","head pain","throbbing head"],spec:"Neurology",dept:"Neurology",severity:2,specialtyOnly:true,advice:"Rest in a quiet, dark room and take paracetamol. See a doctor if it lasts more than 2 days."},
  {keys:["memory loss","forgetfulness","dementia","alzheimer","confusion"],spec:"Neurology",dept:"Neurology",severity:2,specialtyOnly:true,advice:"Book a neurology appointment within the week. Not urgent, but worth a proper evaluation."},
  {keys:["tremor","shaking hands","parkinson","involuntary movement"],spec:"Neurology",dept:"Neurology",severity:2,specialtyOnly:true,advice:"See a neurologist within 1–2 weeks. Not typically an emergency."},
  {keys:["vertigo","dizziness","spinning sensation","balance problem","giddiness"],spec:"Neurology / ENT",dept:"Neurology",severity:2,specialtyOnly:true,advice:"Sit or lie down carefully. If it keeps happening or comes with hearing loss, see a doctor."},
  {keys:["paralysis","weakness one side","hemiplegia","facial palsy","bell's palsy"],spec:"Neurology",dept:"Neurology",severity:3,specialtyOnly:true,advice:"Go to a hospital today. If this came on suddenly, go straight away — don't wait."},

  // ONCOLOGY
  {keys:["cancer","tumour","tumor","lump","growth","mass","malignancy","biopsy"],spec:"Oncology",dept:"Oncology",severity:2,specialtyOnly:true,advice:"See an oncologist within the week. Most lumps turn out to be benign — early evaluation is reassuring."},
  {keys:["blood in stool","rectal bleeding","colorectal"],spec:"Oncology / Gastroenterology",dept:"Oncology",severity:3,specialtyOnly:true,advice:"See a doctor today. Often minor like piles, but should be checked promptly."},
  {keys:["unexplained weight loss","rapid weight loss","losing weight without reason"],spec:"Oncology / Endocrinology",dept:"Oncology",severity:2,specialtyOnly:true,advice:"Book a doctor's appointment this week. Unexplained weight loss needs a check-up."},
  {keys:["coughing blood","hemoptysis","blood in sputum"],spec:"Oncology / Pulmonology",dept:"Oncology",severity:3,specialtyOnly:true,advice:"See a doctor today. Needs investigation — could be infection or something requiring treatment."},

  // ORTHOPEDICS
  {keys:["fracture","broken bone","bone break"],spec:"Orthopedics",dept:"Orthopedics",severity:3,specialtyOnly:true,advice:"Go to a hospital today. Keep the limb still and apply ice gently. Don't try to straighten it."},
  {keys:["joint pain","knee pain","hip pain","shoulder pain","elbow pain","wrist pain"],spec:"Orthopedics",dept:"Orthopedics",severity:2,specialtyOnly:true,advice:"Rest the joint, apply ice, and see a doctor within a few days. Avoid heavy activity."},
  {keys:["back pain","lower back pain","lumbar pain","sciatica","radiating leg pain"],spec:"Orthopedics / Spine",dept:"Spine",severity:2,specialtyOnly:true,advice:"Rest and apply gentle heat. If pain shoots down the leg or causes weakness, see a doctor sooner."},
  {keys:["neck pain","cervical pain","stiff neck with fever","neck stiffness"],spec:"Orthopedics / Neurology",dept:"Neurology",severity:2,specialtyOnly:true,advice:"Stiff neck with fever — see a doctor today. Neck pain alone — rest and see your GP."},
  {keys:["sports injury","sprain","ligament","muscle tear","strain"],spec:"Orthopedics",dept:"Orthopedics",severity:2,specialtyOnly:true,advice:"Rest, ice, gentle compression, and keep it elevated. See a doctor if swelling is very bad."},
  {keys:["arthritis","joint inflammation","rheumatoid","gout","swollen joints"],spec:"Orthopedics / Rheumatology",dept:"Orthopedics",severity:1,specialtyOnly:true,advice:"Not an emergency. Book an appointment with an orthopedic or rheumatology doctor within 1–2 weeks."},
  {keys:["spine","spinal","disc","disc problem","herniated disc","slipped disc"],spec:"Spine Surgery",dept:"Spine",severity:2,specialtyOnly:true,advice:"See a spine specialist within a few days. Avoid lifting heavy objects and get rest."},
  {keys:["trauma","accident","injury","crash"],spec:"Trauma Surgery",dept:"Trauma",severity:4,specialtyOnly:true,advice:"Go to a hospital immediately. Even if pain seems manageable, internal injuries need urgent assessment."},

  // GASTROENTEROLOGY
  {keys:["severe abdominal pain","stomach pain severe","abdomen pain sharp","appendicitis"],spec:"Gastroenterology / Surgery",dept:"Gastroenterology",severity:4,specialtyOnly:true,advice:"Go to a hospital immediately. Severe sudden stomach pain should always be checked right away."},
  {keys:["stomach pain","abdominal pain","stomach ache","tummy pain"],spec:"Gastroenterology",dept:"Gastroenterology",severity:1,specialtyOnly:true,advice:"Try resting and an antacid. If the pain persists more than 2 days or gets worse, see a doctor."},
  {keys:["vomiting blood","hematemesis","throwing up blood"],spec:"Gastroenterology",dept:"Gastroenterology",severity:4,specialtyOnly:true,advice:"This needs immediate hospital attention. Head to the nearest hospital right away."},
  {keys:["jaundice","yellow eyes","yellow skin","liver problem","hepatitis"],spec:"Gastroenterology / Hepatology",dept:"Gastroenterology",severity:3,specialtyOnly:true,advice:"See a doctor today. Yellow eyes or skin means the liver needs to be checked promptly."},
  {keys:["diarrhea","loose stools","loose motion"],spec:"Gastroenterology",dept:"Gastroenterology",severity:1,specialtyOnly:true,advice:"Drink ORS or plenty of water. See a doctor if it continues past 3 days."},
  {keys:["constipation","no bowel movement"],spec:"Gastroenterology",dept:"Gastroenterology",severity:1,specialtyOnly:true,advice:"Increase water and fibre intake. Not urgent unless accompanied by severe pain."},
  {keys:["gas","bloating","acidity","heartburn","indigestion","acid reflux","gerd"],spec:"Gastroenterology",dept:"Gastroenterology",severity:1,specialtyOnly:true,advice:"Try antacids and avoid spicy/oily food. See a doctor if it's disrupting your sleep."},
  {keys:["nausea","vomiting","nauseous"],spec:"Gastroenterology",dept:"Gastroenterology",severity:1,specialtyOnly:true,advice:"Rest and sip water slowly. See a doctor if vomiting is persistent."},

  // NEPHROLOGY / UROLOGY
  {keys:["kidney stone","urinary stone","renal calculi","stone in urine"],spec:"Nephrology / Urology",dept:"Nephrology",severity:3,specialtyOnly:true,advice:"Drink plenty of water and see a doctor today if the pain is severe. Many stones pass with hydration."},
  {keys:["kidney failure","renal failure","dialysis","decreased urination"],spec:"Nephrology",dept:"Nephrology",severity:4,specialtyOnly:true,advice:"Go to a hospital today — kidney function needs to be checked and managed right away."},
  {keys:["urinary tract infection","uti","burning urination","frequent urination","painful urination"],spec:"Urology / Nephrology",dept:"Urology",severity:2,specialtyOnly:true,advice:"Drink lots of water and see a doctor within 1–2 days for medication."},
  {keys:["blood in urine","hematuria","pink urine","red urine"],spec:"Nephrology / Urology",dept:"Nephrology",severity:3,specialtyOnly:true,advice:"See a doctor today to find the cause. Often a UTI or stone, but always worth checking."},

  // OPHTHALMOLOGY
  {keys:["eye pain","eye ache","eye pressure"],spec:"Ophthalmology",dept:"Ophthalmology",severity:3,specialtyOnly:true,advice:"See an eye doctor today. Don't rub the eye. Sudden eye pain can sometimes be an urgent condition."},
  {keys:["sudden vision loss","vision loss","can't see","blind","blackout in eye"],spec:"Ophthalmology",dept:"Ophthalmology",severity:4,specialtyOnly:true,advice:"Go to a hospital right away — sudden vision changes need to be seen by a doctor immediately."},
  {keys:["blurred vision","blurry vision","vision problem","double vision"],spec:"Ophthalmology",dept:"Ophthalmology",severity:2,specialtyOnly:true,advice:"See an eye doctor within 1–2 days. Avoid driving until it's checked."},
  {keys:["red eye","pink eye","eye discharge","conjunctivitis","watery eyes"],spec:"Ophthalmology",dept:"Ophthalmology",severity:1,specialtyOnly:true,advice:"Avoid touching your eyes. Usually viral or allergic — see a doctor if it's not better in 3 days."},
  {keys:["cataract","cloudy vision","night blindness"],spec:"Ophthalmology",dept:"Ophthalmology",severity:1,specialtyOnly:true,advice:"Not urgent. Book an appointment with an eye specialist within 1–2 weeks."},

  // PEDIATRICS
  {keys:["child fever","baby fever","infant fever","high fever in child","fever in baby"],spec:"Pediatrics",dept:"Pediatrics",severity:3,specialtyOnly:true,advice:"For very young babies, see a doctor today. For older children with a high fever, go within the day."},
  {keys:["child not eating","baby not feeding","infant not feeding"],spec:"Pediatrics",dept:"Pediatrics",severity:2,specialtyOnly:true,advice:"See a pediatrician today if it's been more than 24 hours. Keep an eye on hydration."},
  {keys:["child rash","skin rash in child","baby rash"],spec:"Pediatrics",dept:"Pediatrics",severity:2,specialtyOnly:true,advice:"If there's also a fever, see a doctor today. Otherwise, monitor and book an appointment soon."},
  {keys:["child vomiting","baby vomiting","infant vomiting"],spec:"Pediatrics",dept:"Pediatrics",severity:2,specialtyOnly:true,advice:"Keep the child hydrated with small sips. See a pediatrician if it continues or child seems very tired."},
  {keys:["child breathing difficulty","baby breathing fast","wheezing child"],spec:"Pediatrics",dept:"Pediatrics",severity:4,specialtyOnly:true,advice:"Take the child to a hospital right away. Breathing difficulty in children always needs immediate attention."},

  // PULMONOLOGY
  {keys:["asthma attack","asthma","wheezing","bronchospasm"],spec:"Pulmonology",dept:"Pulmonology",severity:3,specialtyOnly:true,advice:"Use your inhaler if you have one. Sit upright and try to stay calm. Go to a hospital if there's no relief."},
  {keys:["pneumonia","lung infection","chest infection"],spec:"Pulmonology",dept:"Pulmonology",severity:3,specialtyOnly:true,advice:"See a doctor today — a chest infection usually needs medication and possibly a chest X-ray."},
  {keys:["tb","tuberculosis","persistent cough","cough 3 weeks","night sweats with cough"],spec:"Pulmonology",dept:"Pulmonology",severity:2,specialtyOnly:true,advice:"See a doctor within a few days. TB is very treatable when caught early."},
  {keys:["cough","dry cough","wet cough","chronic cough"],spec:"Pulmonology / General Medicine",dept:"Pulmonology",severity:1,specialtyOnly:true,advice:"Rest and drink warm fluids. See a doctor if the cough lasts more than 2 weeks."},

  // DERMATOLOGY
  {keys:["skin rash","rash","hives","urticaria","skin allergy","itching","itchy skin","psoriasis","eczema"],spec:"Dermatology",dept:"Dermatology",severity:2,specialtyOnly:true,advice:"Try an antihistamine and avoid the likely trigger. See a dermatologist if it spreads or keeps coming back."},
  {keys:["severe allergy","anaphylaxis","throat swelling","swollen throat","difficulty swallowing"],spec:"Emergency / Allergy",dept:"Dermatology",severity:4,specialtyOnly:true,advice:"Go to a hospital immediately. Throat swelling with an allergic reaction is a medical emergency."},
  {keys:["burn","burning skin","scald","fire burn","skin burn","chemical burn","acid burn","flame burn"],spec:"Burns & Plastic Surgery",dept:"Burns",severity:3,specialtyOnly:true,advice:"Cool with running water for 10–20 minutes. Go to a hospital with a burns unit for any burn larger than your palm."},
  {keys:["wound","cut","bleeding","laceration","deep cut"],spec:"Surgery / Emergency",dept:"Orthopedics",severity:3,specialtyOnly:true,advice:"Press firmly on the wound to slow bleeding. Go to a hospital if the wound is deep or bleeding won't stop."},

  // PSYCHIATRY
  {keys:["suicidal","want to die","self harm","depression severe"],spec:"Psychiatry",dept:"Psychiatry",severity:3,specialtyOnly:true,advice:"Please talk to someone you trust right now — a family member, friend, or any doctor. You're not alone."},
  {keys:["anxiety","panic attack","anxiety attack","panic","racing heart with anxiety"],spec:"Psychiatry",dept:"Psychiatry",severity:2,specialtyOnly:true,advice:"Try slow, deep breathing. You're going to be okay. See a doctor or counselor within the week."},
  {keys:["depression","feeling hopeless","sadness","mental health","mood disorder"],spec:"Psychiatry",dept:"Psychiatry",severity:2,specialtyOnly:true,advice:"Reach out to someone you trust. Seeing a doctor or counselor within the week is a good step."},

  // ENT
  {keys:["ear pain","earache","ear infection","ear discharge","hearing loss"],spec:"ENT",dept:"ENT",severity:2,specialtyOnly:true,advice:"See an ENT doctor within 1–2 days. Avoid inserting anything into the ear."},
  {keys:["sore throat","throat pain","tonsillitis","tonsilitis"],spec:"ENT / General Medicine",dept:"ENT",severity:1,specialtyOnly:true,advice:"Warm salt water gargles help. See a doctor if you have fever or find it hard to swallow."},
  {keys:["nose bleed","epistaxis","bleeding nose"],spec:"ENT",dept:"ENT",severity:2,specialtyOnly:true,advice:"Pinch your nose and lean slightly forward for 10 minutes. See a doctor if it doesn't stop."},
  {keys:["sinusitis","sinus pain","sinus headache","blocked nose","stuffy nose"],spec:"ENT",dept:"ENT",severity:1,specialtyOnly:true,advice:"Steam inhalation and saline rinse help. See a doctor if fever or pain lasts more than 10 days."},

  // ENDOCRINOLOGY
  {keys:["diabetes","sugar high","blood sugar high","hyperglycemia"],spec:"Endocrinology / Diabetology",dept:"Endocrinology",severity:2,specialtyOnly:true,advice:"Take your prescribed medication and monitor your sugar. See a doctor within 2 days if consistently high."},
  {keys:["low sugar","hypoglycemia","sugar low","blood sugar low","feeling shaky and sweaty"],spec:"Endocrinology",dept:"Endocrinology",severity:3,specialtyOnly:true,advice:"Have some fruit juice or sugary food right away. See a doctor today if it's happening frequently."},
  {keys:["thyroid","thyroid problem","goitre","hypothyroid","hyperthyroid"],spec:"Endocrinology",dept:"Endocrinology",severity:1,specialtyOnly:true,advice:"Not urgent. See an endocrinologist within 1–2 weeks for blood tests."},

  // NEPHROLOGY (TRANSPLANT)
  {keys:["organ transplant","transplant","liver transplant","kidney transplant"],spec:"Transplant Surgery",dept:"Transplant",severity:2,specialtyOnly:true,advice:"Contact a transplant centre directly. This requires specialist evaluation and registration."},

  // GENERAL
  {keys:["fever","high fever","temperature","pyrexia"],spec:"General Medicine",dept:"Cardiology",severity:2,specialtyOnly:false,advice:"Take paracetamol, rest, and stay hydrated. See a doctor if it lasts more than 3 days or is very high."},
  {keys:["dehydration","dry mouth","not urinating","dark urine"],spec:"General Medicine",dept:"Cardiology",severity:2,specialtyOnly:false,advice:"Drink water or ORS steadily. See a doctor if you can't keep fluids down."},
  {keys:["fatigue","tiredness","weakness","always tired","exhaustion"],spec:"General Medicine",dept:"Cardiology",severity:1,specialtyOnly:false,advice:"Rest and stay hydrated. If tiredness persists beyond 2 weeks, see a doctor — could be anaemia or thyroid."},
  {keys:["general checkup","routine checkup","health check","annual checkup","preventive care"],spec:"General Medicine",dept:"Cardiology",severity:1,specialtyOnly:false,advice:"Great habit! Book a comprehensive health check package at any of the hospitals below."},
];

const SEVERITY_META = {
  1:{label:"Mild — likely manageable at home",color:"#2a9d6e",bg:"rgba(42,157,110,0.15)",icon:"🟢",action:"Monitor your symptoms. If things don't improve in 2–3 days, book a doctor's appointment."},
  2:{label:"Moderate — worth seeing a doctor soon",color:"#9a6f0a",bg:"rgba(154,111,10,0.15)",icon:"🟡",action:"Try to see a doctor within the next day or two. No need to rush, but don't keep putting it off."},
  3:{label:"Urgent — please see a doctor today",color:"#c0392b",bg:"rgba(192,57,43,0.15)",icon:"🔴",action:"Visit a hospital or clinic today. The sooner the better — don't wait overnight."},
  4:{label:"Needs immediate attention",color:"#7b1a1a",bg:"rgba(192,57,43,0.22)",icon:"🚨",action:"Please head to the nearest hospital right away. Take someone with you if possible."},
};

function matchSymptoms(inputArr){
  const combined=inputArr.map(s=>s.toLowerCase()).join(' ');
  let best=null,bestSev=0;
  for(const entry of SYMPTOM_DB){
    for(const key of entry.keys){
      if(combined.includes(key.toLowerCase())){
        if(entry.severity>bestSev){bestSev=entry.severity;best=entry}
        break;
      }
    }
  }
  return best;
}

const CITY_NEARBY = {
  "Chennai":["Chennai","Kancheepuram"],"Coimbatore":["Coimbatore","Erode","Tiruppur"],
  "Madurai":["Madurai","Dindigul","Sivaganga","Virudhunagar"],"Tiruchirappalli":["Tiruchirappalli","Thanjavur","Pudukkottai"],
  "Salem":["Salem","Namakkal","Dharmapuri","Erode"],"Tirunelveli":["Tirunelveli","Thoothukudi","Ramanathapuram"],
  "Vellore":["Vellore","Krishnagiri","Dharmapuri"],"Thoothukudi":["Thoothukudi","Tirunelveli","Ramanathapuram"],
  "Erode":["Erode","Tiruppur","Salem","Coimbatore"],"Tiruppur":["Tiruppur","Coimbatore","Erode"],
  "Dindigul":["Dindigul","Madurai","Namakkal"],"Thanjavur":["Thanjavur","Tiruchirappalli","Nagapattinam","Kumbakonam"],
  "Kancheepuram":["Kancheepuram","Chennai"],"Cuddalore":["Cuddalore","Villupuram","Puducherry"],
  "Nagapattinam":["Nagapattinam","Thanjavur","Kumbakonam"],"Namakkal":["Namakkal","Salem","Erode","Tiruchirappalli"],
  "Ramanathapuram":["Ramanathapuram","Virudhunagar","Thoothukudi","Sivaganga"],
  "Sivaganga":["Sivaganga","Madurai","Ramanathapuram"],"Villupuram":["Villupuram","Cuddalore","Puducherry"],
  "Puducherry":["Villupuram","Cuddalore","Puducherry"],"Virudhunagar":["Virudhunagar","Madurai","Tirunelveli"],
};

// ════════════ AUTH — MongoDB API backed ════════════
let CU = null;

// On page load — silently restore session if cookie is still valid
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res  = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    if (data.success) { CU = data.user; launchDash(); }
  } catch (e) { /* not logged in — stay on login page */ }
});

function vlUn(el,errId,okId){
  const ok=/^[a-zA-Z0-9_]{3,20}$/.test(el.value);
  const empty=el.value.length===0;
  el.classList.toggle('err',!empty&&!ok);el.classList.toggle('ok',ok);
  if(errId)document.getElementById(errId).classList.toggle('show',!empty&&!ok);
  if(okId)document.getElementById(okId).classList.toggle('show',ok);
  return ok;
}
function vlEm(el,errId){
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
  const empty=el.value.length===0;
  el.classList.toggle('err',!empty&&!ok);el.classList.toggle('ok',ok);
  document.getElementById(errId).classList.toggle('show',!empty&&!ok);
  return ok;
}
function vlLPw(el){
  const ok=el.value.length>=8;const empty=el.value.length===0;
  el.classList.toggle('err',!empty&&!ok);el.classList.toggle('ok',ok);
  document.getElementById('l-pw-err').classList.toggle('show',!empty&&!ok);
  return ok;
}
function vlNm(el,errId){
  const ok=el.value.trim().length>=2;const empty=el.value.length===0;
  el.classList.toggle('err',!empty&&!ok);el.classList.toggle('ok',ok);
  document.getElementById(errId).classList.toggle('show',!empty&&!ok);
  return ok;
}
function vlCp(el){
  const pwd=document.getElementById('r-pw').value;
  const ok=el.value===pwd&&el.value.length>0;
  const empty=el.value.length===0;
  el.classList.toggle('err',!empty&&!ok);el.classList.toggle('ok',ok);
  document.getElementById('r-cp-err').classList.toggle('show',!empty&&!ok);
  return ok;
}
function updStr(el){
  const v=el.value;
  const c={len:v.length>=8,up:/[A-Z]/.test(v),num:/[0-9]/.test(v),sym:/[^A-Za-z0-9]/.test(v)};
  const sc=Object.values(c).filter(Boolean).length;
  ['pb1','pb2','pb3','pb4'].forEach((id,i)=>{
    const b=document.getElementById(id);b.className='pb';
    if(i<sc)b.classList.add(['pw','pf','pg','ps'][sc-1]);
  });
  document.getElementById('pwd-lbl').textContent=sc>0?['','Weak','Fair','Good','Strong!'][sc]:'Enter a password';
  ['len','up','num','sym'].forEach((k,i)=>document.getElementById(['req-len','req-up','req-num','req-sym'][i]).classList.toggle('met',c[k]));
}
function tpwd(id,btn){const el=document.getElementById(id);el.type=el.type==='password'?'text':'password';btn.style.opacity=el.type==='text'?'1':'.5'}
function showReg(){document.getElementById('wrap-login').style.display='none';document.getElementById('wrap-reg').style.display='';}
function showLogin(){document.getElementById('wrap-reg').style.display='none';document.getElementById('wrap-login').style.display='';}

async function doLogin(){
  const un=document.getElementById('l-un');const em=document.getElementById('l-em');const pw=document.getElementById('l-pw');
  const e=document.getElementById('login-err');
  if(!vlUn(un)){document.getElementById('l-un-err').classList.add('show');un.classList.add('err');return;}
  if(!vlEm(em,'l-em-err')){em.classList.add('err');return;}
  if(!vlLPw(pw)){pw.classList.add('err');return;}
  try {
    const res=await fetch('/api/auth/login',{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',
      body:JSON.stringify({username:un.value,email:em.value,password:pw.value}),
    });
    const data=await res.json();
    if(!data.success){
      e.textContent=data.message;e.classList.add('show');
      [un,em,pw].forEach(el=>{el.classList.add('err');el.classList.remove('ok');});
      return;
    }
    e.classList.remove('show');CU=data.user;launchDash();
  } catch(err){
    e.textContent='Could not connect to server. Make sure npm start is running.';e.classList.add('show');
  }
}

async function doReg(){
  const fn=document.getElementById('r-fn');const ln=document.getElementById('r-ln');
  const un=document.getElementById('r-un');const em=document.getElementById('r-em');
  const pw=document.getElementById('r-pw');const cp=document.getElementById('r-cp');
  const e=document.getElementById('reg-err');
  if(!vlNm(fn,'r-fn-err')||!vlNm(ln,'r-ln-err')||!vlUn(un,'r-un-err','r-un-ok')||!vlEm(em,'r-em-err')){
    e.textContent='Please fix all errors before continuing.';e.classList.add('show');return;
  }
  if(pw.value.length<8){e.textContent='Password must be at least 8 characters.';e.classList.add('show');return;}
  if(!vlCp(cp)){e.textContent='Passwords do not match.';e.classList.add('show');return;}
  try {
    const res=await fetch('/api/auth/register',{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',
      body:JSON.stringify({firstName:fn.value,lastName:ln.value,username:un.value,email:em.value,password:pw.value}),
    });
    const data=await res.json();
    if(!data.success){e.textContent=data.message;e.classList.add('show');return;}
    e.classList.remove('show');CU=data.user;launchDash();
  } catch(err){
    e.textContent='Could not connect to server. Make sure npm start is running.';e.classList.add('show');
  }
}

function launchDash(){
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-dashboard').classList.add('active');
  initDash();toast('Welcome to MediSeek TN!','tg');
}

async function doLogout(){
  await fetch('/api/auth/logout',{method:'POST',credentials:'include'});
  CU=null;
  document.getElementById('page-dashboard').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
  toast('Signed out successfully.');
}

// ════════════ DASHBOARD INIT ════════════
function initDash(){
  const name=CU.name||CU.username;
  const parts=name.trim().split(' ');
  const init=parts.length>=2?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():name.substring(0,2).toUpperCase();
  document.getElementById('nav-av').textContent=init;
  document.getElementById('pf-av').textContent=init;
  const hr=new Date().getHours();
  document.getElementById('greeting').textContent=(hr<12?'Good morning':hr<17?'Good afternoon':'Good evening')+', '+parts[0];
  document.getElementById('ddate').textContent=new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('pf-name').value=name;
  document.getElementById('pf-un').textContent='@'+CU.username;
  document.getElementById('pf-em').textContent=CU.email;
  document.getElementById('pf-since').textContent=new Date(CU.joined||Date.now()).toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  renderHome();renderFull();popCmpSelects();renderAnalytics();
}

// ════════════ HOSPITAL CARD ════════════
function sc(s){return s>=90?'var(--accent)':s>=80?'var(--gold)':s>=70?'var(--blue)':'var(--text3)'}
function rk(i){return i===0?'r1':i===1?'r2':i===2?'r3':'rn'}
function card(h,idx){
  const certs=h.certs.map(c=>`<span class="cert c${c[0].toLowerCase()}">${c}</span>`).join('');
  const specs=h.specialities.slice(0,2).map(s=>`<span class="cert" style="background:var(--surface2);color:var(--text2)">${s}</span>`).join('');
  const col=sc(h.score);
  const isDed=h.dedicated===true;
  const dedBadge=isDed
    ?`<span style="display:inline-flex;align-items:center;gap:3px;background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:2px 9px;border-radius:10px;border:1px solid #f59e0b;white-space:nowrap;">⭐ Dedicated ${h.dedicatedFor||'Specialist'} Centre</span>`
    :'';
  return `<a class="hcard" href="${h.maps}" target="_blank" rel="noopener" title="Open ${h.name} in Google Maps" style="${isDed?'border:2px solid #f59e0b;background:#fffdf5;':''}">
    <div class="hrank ${rk(idx)}">${idx+1}</div>
    <div class="hinfo">
      <div class="hname" style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;">${h.name}${dedBadge}</div>
      <div class="hmeta"><span>${h.type}</span><span>${h.city}, TN</span><span>${h.beds} beds</span><span>Est. ${h.estd}</span></div>
      <div class="certs">${certs}${specs}</div>
      <div class="glink-badge">📍 Open in Google Maps</div>
    </div>
    <div class="hbars">
      <div class="hbrow"><span class="hblbl">Infrastructure</span><div class="hbtrk"><div class="hbfil" style="width:${h.infra}%"></div></div></div>
      <div class="hbrow"><span class="hblbl">Emergency</span><div class="hbtrk"><div class="hbfil hbg" style="width:${h.emergency}%"></div></div></div>
      <div class="hbrow"><span class="hblbl">Specialists</span><div class="hbtrk"><div class="hbfil hbb" style="width:${h.specialists}%"></div></div></div>
    </div>
    <div class="hscore">
      <div class="sring" style="border-color:${isDed?'#f59e0b':col};${isDed?'border-width:3px':''}"><div class="snum" style="color:${isDed?'#92400e':col}">${h.score}</div><div class="sden">/100</div></div>
      <div class="slbl">Quality score</div>
    </div>
  </a>`;
}

function renderHome(){document.getElementById('home-list').innerHTML=HOSPITALS.slice(0,5).map((h,i)=>card(h,i)).join('')}
function renderFull(data){
  const list=data||HOSPITALS;
  document.getElementById('r-count').textContent=`Showing ${list.length} hospital${list.length!==1?'s':''} in Tamil Nadu`;
  document.getElementById('full-list').innerHTML=list.length?list.map((h,i)=>card(h,i)).join(''):'<div style="text-align:center;padding:3rem;color:var(--text3);font-size:16px">No hospitals match the selected filters.</div>';
}

// ════════════ SMART FINDER ════════════
let selectedTags=new Set();
function toggleTag(el,sym){
  if(selectedTags.has(sym)){selectedTags.delete(sym);el.classList.remove('selected')}
  else{selectedTags.add(sym);el.classList.add('selected')}
}

function runFinder(){
  const city=document.getElementById('fp-city').value;
  const textSym=document.getElementById('fp-symptom').value.trim();
  if(!city){toast('Please select your city first.','tr');return}

  const allSymptoms=[...selectedTags];
  if(textSym)allSymptoms.push(textSym);

  const res=document.getElementById('fp-result');
  res.classList.add('show');
  res.innerHTML='<div class="fp-typing"><span></span><span></span><span></span></div> Analysing symptoms and finding the best hospitals...';

  setTimeout(()=>{
    const nearCities=CITY_NEARBY[city]||[city];
    const nearby=HOSPITALS.filter(h=>h.nearby.some(n=>nearCities.includes(n)));

    const match=allSymptoms.length>0?matchSymptoms(allSymptoms):null;
    const sev=match?SEVERITY_META[match.severity]:null;
    const spec=match?match.spec:'General Medicine';
    const dept=match?match.dept:null;
    const preferSpecialized=match&&match.specialtyOnly===true;

    // ── Build results with DEDICATED hospitals first ─────────────────
    let specialized=[];
    let generalist=[];

    if(dept){
      // DEDICATED = hospitals that exist ONLY for this type of care
      // They are marked dedicated:true and their specialities contain this dept
      const allWithDept=HOSPITALS.filter(h=>
        h.specialities.includes(dept)
        &&h.nearby.some(n=>nearCities.includes(n))
      );
      const allWithDeptTN=HOSPITALS.filter(h=>h.specialities.includes(dept));

      // True specialists = dedicated:true hospitals with this dept, from anywhere in TN
      specialized=allWithDeptTN.filter(h=>h.dedicated===true);

      // Generalists = non-dedicated nearby hospitals that treat this
      const specIds=new Set(specialized.map(h=>h.id));
      generalist=allWithDept.filter(h=>!specIds.has(h.id));

      // If no dedicated hospital exists for this dept, show top-ranked nearby hospitals
      if(specialized.length===0){
        generalist=allWithDept;
      }
    } else {
      generalist=nearby;
    }

    // Sort each group by score (or emergency+score for high severity)
    const sortFn = match&&match.severity>=3
      ? (a,b)=>(b.emergency+b.score)-(a.emergency+a.score)
      : (a,b)=>b.score-a.score;

    specialized.sort(sortFn);
    generalist.sort(sortFn);

    // Remove duplicates from generalist (already shown in specialized)
    const specIds=new Set(specialized.map(h=>h.id));
    generalist=generalist.filter(h=>!specIds.has(h.id));

    const sympText=allSymptoms.length>0?allSymptoms.join(', '):'No symptoms specified';

    // ── Severity banner ──────────────────────────────────────────────
    let sevHtml='';
    if(sev){
      sevHtml=`<div style="background:${sev.bg};border:1.5px solid ${sev.color};border-radius:10px;padding:14px 16px;margin-bottom:14px;">
        <div style="font-size:16px;font-weight:700;color:${sev.color};margin-bottom:6px;">${sev.icon} ${sev.label}</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.9);margin-bottom:6px;">${match.advice}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7);">${sev.action}</div>
      </div>`;
    }

    // ── Hospital card renderer inside finder ─────────────────────────
    const hospCard=(h,i,isSpecialized)=>`
      <a class="fp-res-hosp" href="${h.maps}" target="_blank" rel="noopener"
        style="${isSpecialized?'border:1.5px solid #f59e0b;background:rgba(245,158,11,0.1);':''}">
        <div class="fp-res-rank" style="${isSpecialized?'background:rgba(245,158,11,0.25);color:#f59e0b;font-size:14px;':''}">${isSpecialized?'⭐':i+1}</div>
        <div class="fp-res-info">
          <div class="fp-res-name">
            ${h.name}
            ${isSpecialized?`<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:1px 8px;border-radius:8px;margin-left:6px;border:1px solid #f59e0b;">Dedicated ${h.dedicatedFor||'Specialist'} Hospital</span>`:''}
          </div>
          <div class="fp-res-meta">${h.type} · ${h.city} · ${h.certs.join(', ')||'No cert'} · Specialist score: ${h.specialists}/100</div>
          <div class="fp-res-meta" style="margin-top:2px;color:rgba(255,255,255,0.5);font-size:11px">${h.specialities.slice(0,3).join(' · ')}</div>
        </div>
        <div class="fp-res-score" style="${isSpecialized?'color:#f59e0b;':''}">${h.score}</div>
      </a>`;

    // ── Assemble output ──────────────────────────────────────────────
    const topSpecialized=specialized.slice(0,3);
    const topGeneralist=generalist.slice(0,preferSpecialized?3:5);

    let specializedSection='';
    if(topSpecialized.length>0){
      specializedSection=`
        <div style="font-size:13px;font-weight:700;color:#f59e0b;margin-bottom:8px;display:flex;align-items:center;gap:7px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span>
          ⭐ Dedicated hospitals — exist only for ${spec}
        </div>
        ${topSpecialized.map((h,i)=>hospCard(h,i+1,true)).join('')}`;
    }

    let generalistSection='';
    if(topGeneralist.length>0){
      const genLabel=topSpecialized.length>0
        ?`Also nearby — multi-speciality hospitals that treat ${spec}`
        :`Top hospitals for ${spec} near ${city}`;
      generalistSection=`
        <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.6);margin:${topSpecialized.length>0?'16':'0'}px 0 8px;display:flex;align-items:center;gap:7px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.4);"></span>
          ${genLabel}
        </div>
        ${topGeneralist.map((h,i)=>hospCard(h,i+1,false)).join('')}`;
    }

    if(topSpecialized.length===0&&topGeneralist.length===0){
      res.innerHTML=`${sevHtml}<div class="fp-res-title">No hospitals found near ${city} for your symptoms.</div>
        <p style="color:rgba(255,255,255,.7);font-size:14px">Try expanding to a nearby city or selecting a broader symptom.</p>`;
      return;
    }

    const specialTip=topSpecialized.length===0&&dept
      ?`<div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:13px;color:rgba(255,255,255,0.8);">
          ℹ No dedicated <strong style="color:#f59e0b">${spec}</strong> hospital found in Tamil Nadu yet. Showing the best multi-speciality hospitals near you that have this department.
        </div>`
      :'';

    res.innerHTML=`
      ${sevHtml}
      <div class="fp-res-title">Best hospitals for: ${spec} — near ${city}</div>
      <p style="color:rgba(255,255,255,.65);font-size:13px;margin-bottom:12px">Symptoms: ${sympText}</p>
      ${specialTip}
      ${specializedSection}
      ${generalistSection}
      <p style="font-size:12px;color:rgba(255,255,255,.4);margin-top:12px">⭐ = hospital dedicated solely to this speciality · Click any result to open in Google Maps · Always consult a physician.</p>`;
  },1300);
}

// ════════════ FILTERS ════════════
function applyF(){
  const type=document.getElementById('f-type').value;
  const city=document.getElementById('f-city').value;
  const cert=document.getElementById('f-cert').value;
  const spec=document.getElementById('f-spec').value;
  let f=HOSPITALS;
  if(type)f=f.filter(h=>h.type===type);
  if(city)f=f.filter(h=>h.city===city);
  if(cert)f=f.filter(h=>h.certs.includes(cert));
  if(spec)f=f.filter(h=>h.specialities.includes(spec)||h.specialities.includes('All Departments'));
  renderFull(f);
}
function resetF(){['f-type','f-city','f-cert','f-spec'].forEach(id=>document.getElementById(id).value='');renderFull()}

// ════════════ SEARCH ════════════
let _dc=false;
function scheduleClose(){setTimeout(()=>{if(!_dc)closeSearch()},150)}
function doSearch(q){
  const dd=document.getElementById('sdrop');
  if(!q||q.length<2){dd.className='sdrop';return}
  const lq=q.toLowerCase();
  const res=HOSPITALS.filter(h=>h.name.toLowerCase().includes(lq)||h.city.toLowerCase().includes(lq)||h.type.toLowerCase().includes(lq)||h.specialities.some(s=>s.toLowerCase().includes(lq))||h.certs.some(c=>c.toLowerCase().includes(lq))).slice(0,10);
  dd.innerHTML=res.length?res.map(h=>`
    <div class="sri" onmousedown="_dc=true" onmouseup="_dc=false" onclick="openSriMaps(${h.id})">
      <div class="sri-name">${hl(h.name,q)}</div>
      <div class="sri-meta">${h.type} · ${h.city} · Score: ${h.score} · <span style="color:var(--accent)">📍 Open in Google Maps</span></div>
    </div>`).join(''):`<div class="sempty">No hospitals found for "${q}"</div>`;
  dd.className='sdrop open';
}
function hl(t,q){return t.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<strong style="color:var(--accent)">$1</strong>')}
function openSriMaps(id){
  _dc=false;
  const h=HOSPITALS.find(x=>x.id===id);if(!h)return;
  window.open(h.maps,'_blank','noopener');
  closeSearch();document.getElementById('gsearch').value='';
  toast(`Opening ${h.name} in Google Maps…`,'tg');
}
function closeSearch(){_dc=false;document.getElementById('sdrop').className='sdrop'}

// ════════════ COMPARE ════════════
function popCmpSelects(){
  const opts=HOSPITALS.map(h=>`<option value="${h.id}">${h.name} (${h.city}) — ${h.score}</option>`).join('');
  document.getElementById('cmp-a').innerHTML='<option value="">Select hospital A...</option>'+opts;
  document.getElementById('cmp-b').innerHTML='<option value="">Select hospital B...</option>'+opts;
}
function doCompare(){
  const idA=+document.getElementById('cmp-a').value,idB=+document.getElementById('cmp-b').value;
  if(!idA||!idB){toast('Please select two hospitals.','tr');return}
  if(idA===idB){toast('Please select two different hospitals.','tr');return}
  const a=HOSPITALS.find(h=>h.id===idA),b=HOSPITALS.find(h=>h.id===idB);
  const metrics=[['Type',h=>h.type,false],['City',h=>h.city,false],['Beds',h=>h.beds,true],['Established',h=>h.estd,false],['Infrastructure',h=>h.infra+'%',true],['Emergency',h=>h.emergency+'%',true],['Specialists',h=>h.specialists+'%',true],['Certifications',h=>h.certs.join(', ')||'None',false],['Specialities',h=>h.specialities.slice(0,2).join(', '),false]];
  const crd=(h,o)=>{
    const win=h.score>=o.score;
    return `<div class="ccard${win?' cwin':''}">
      ${win?'<div class="cwin-b">Higher overall score</div>':''}
      <div class="chn">${h.name}</div><div class="chs">${h.type} · ${h.city}</div>
      <div class="cscore">${h.score}<span style="font-size:18px;color:var(--text3)">/100</span></div><div class="csv">Overall quality score</div>
      <div class="cdiv"></div>
      ${metrics.map(([l,fn,cmp])=>{
        let cls='';if(cmp){const hv=parseFloat(fn(h)),ov=parseFloat(fn(o));cls=hv>=ov?'win':'lose'}
        return `<div class="crow"><span class="ck">${l}</span><span class="cv ${cls}">${fn(h)}</span></div>`;
      }).join('')}
      <a href="${h.maps}" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;padding:8px 16px;background:var(--accent-light);color:var(--accent);border-radius:var(--r);font-size:14px;font-weight:500;text-decoration:none">📍 Open in Google Maps</a>
    </div>`;
  };
  const g=document.getElementById('cmp-out');
  g.style.display='grid';g.innerHTML=crd(a,b)+crd(b,a);
  g.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ════════════ ANALYTICS ════════════
function renderAnalytics(){
  // Bar: avg score by type
  const tg={};HOSPITALS.forEach(h=>{if(!tg[h.type])tg[h.type]=[];tg[h.type].push(h.score)});
  const td=Object.entries(tg).map(([t,s])=>[t,Math.round(s.reduce((a,b)=>a+b,0)/s.length)]);
  renderBars('bc-type',td,['#2a9d6e','#1a4f8a','#9a6f0a']);

  // Donut
  const tc={};HOSPITALS.forEach(h=>{tc[h.type]=(tc[h.type]||0)+1});
  renderDonut(Object.entries(tc).map(([l,v])=>({label:l,val:v})),['#2a9d6e','#1a4f8a','#9a6f0a']);

  // Accreditation bars
  const tot=HOSPITALS.length;
  const accData=[
    {label:'NABH certified',pct:Math.round(HOSPITALS.filter(h=>h.certs.includes('NABH')).length/tot*100),color:'#2a9d6e'},
    {label:'JCI certified',pct:Math.round(HOSPITALS.filter(h=>h.certs.includes('JCI')).length/tot*100),color:'#9a6f0a'},
    {label:'NABL certified',pct:Math.round(HOSPITALS.filter(h=>h.certs.includes('NABL')).length/tot*100),color:'#1a4f8a'},
    {label:'No certification',pct:Math.round(HOSPITALS.filter(h=>h.certs.length===0).length/tot*100),color:'#9c9588'},
  ];
  document.getElementById('acc-bars').innerHTML=accData.map(a=>`
    <div class="abar">
      <div class="abar-h"><span class="abar-l">${a.label}</span><span class="abar-v">${a.pct}%</span></div>
      <div class="atrk"><div class="afil" style="width:${a.pct}%;background:${a.color}"></div></div>
    </div>`).join('');

  // Bar: top 6 cities
  const cg={};HOSPITALS.forEach(h=>{if(!cg[h.city])cg[h.city]=[];cg[h.city].push(h.score)});
  const cd=Object.entries(cg).map(([c,s])=>[c,Math.round(s.reduce((a,b)=>a+b,0)/s.length)]).sort((a,b)=>b[1]-a[1]).slice(0,6);
  renderBars('bc-city',cd,null);
}

function renderBars(cid,data,colors){
  const maxV=Math.max(...data.map(d=>d[1]));
  const chartH=160;
  document.getElementById(cid).innerHTML=data.map(([lbl,val],i)=>{
    const h=Math.max(Math.round((val/maxV)*chartH),4);
    const color=colors?colors[i%colors.length]:'#2a9d6e';
    const short=lbl.length>8?lbl.substring(0,8)+'…':lbl;
    return `<div class="bc" style="flex:1"><div class="bbar" style="height:${h}px;background:${color}"><span class="btip">${val}</span></div><span class="blbl">${short}</span></div>`;
  }).join('');
}

function renderDonut(data,colors){
  const tot=data.reduce((a,d)=>a+d.val,0);
  const cx=70,cy=70,r=48,sw=24,circ=2*Math.PI*r;
  let off=0;
  const paths=data.map((d,i)=>{
    const pct=d.val/tot,dash=pct*circ;
    const p=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="${sw}" stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${-off*circ}" transform="rotate(-90 ${cx} ${cy})"/>`;
    off+=pct;return p;
  }).join('');
  document.getElementById('donut-svg').innerHTML=paths+`<text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="13" fill="#5c5750" font-family="Outfit,sans-serif">${tot} total</text>`;
  document.getElementById('donut-leg').innerHTML=data.map((d,i)=>`<div class="lrow"><div class="ldot" style="background:${colors[i]}"></div><span class="lname">${d.label}</span><span class="lval">${d.val}</span></div>`).join('');
}

// ════════════ MAP CLUSTER LOADER ════════════
function loadCluster(btn, query){
  document.querySelectorAll('.mabtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const encoded=encodeURIComponent(query);
  // Use the embed search mode — shows red pin markers for all matching places
  document.getElementById('gmap-frame').src=
    `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFmBWY&q=${encoded}&zoom=10`;
}

// ════════════ NAVIGATION ════════════
function navGo(btn,sec){
  document.querySelectorAll('.nlink').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  showSec(sec);syncSb(sec);
}
function sbGo(btn,sec){
  document.querySelectorAll('.sbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');showSec(sec);syncNl(sec);
}
function showSec(sec){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById('sec-'+sec);
  if(el){el.classList.add('active','fade-up');setTimeout(()=>el.classList.remove('fade-up'),400)}
}
function syncSb(sec){
  const map={home:0,rankings:1,compare:2,analytics:3,profile:4};
  const btns=document.querySelectorAll('.sbtn');
  btns.forEach(b=>b.classList.remove('active'));
  if(map[sec]!==undefined&&btns[map[sec]])btns[map[sec]].classList.add('active');
}
function syncNl(sec){
  const map={home:0,rankings:1,compare:2,analytics:3};
  const links=document.querySelectorAll('.nlink');
  links.forEach(b=>b.classList.remove('active'));
  if(map[sec]!==undefined)links[map[sec]]?.classList.add('active');
}

// ════════════ PROFILE ════════════
async function saveProfile(){
  const n=document.getElementById('pf-name').value.trim();
  if(n.length<2){toast('Name must be at least 2 characters.','tr');return;}
  const parts=n.split(' ');
  try{
    await fetch('/api/auth/profile',{
      method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',
      body:JSON.stringify({firstName:parts[0],lastName:parts.slice(1).join(' ')||parts[0]}),
    });
    CU.name=n;
    const init=parts.length>=2?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():n.substring(0,2).toUpperCase();
    document.getElementById('nav-av').textContent=init;document.getElementById('pf-av').textContent=init;
    toast('Profile updated!','tg');
  }catch(e){toast('Could not update profile.','tr');}
}

// ════════════ TOAST ════════════
function toast(msg,cls){
  const el=document.getElementById('toast-el');
  el.textContent=msg;el.className='toast show'+(cls?' '+cls:'');
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3500);
}

function loadCluster(btn, query) {
  // remove active class from all buttons
  document.querySelectorAll(".mabtn").forEach(b => b.classList.remove("active"));

  // add active class to clicked button
  btn.classList.add("active");

  // update map
  const iframe = document.getElementById("gmap-frame");
  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
}