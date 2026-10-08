import{a as y,S as o}from"./schemes-Brcl_bvk.js";const f="sm_profile",A="sm_saved",k={get(){try{return JSON.parse(localStorage.getItem(f))||null}catch{return null}},save(s){const i={...this.get()||{},...s};return i.isComplete=!!(i.age&&i.gender&&i.state&&i.occupation&&i.annualIncome),localStorage.setItem(f,JSON.stringify(i)),i},reset(){localStorage.removeItem(f)},isComplete(){const s=this.get();return s?!!(s.age&&s.gender&&s.state&&s.occupation&&s.annualIncome):!1}},I=(s,a)=>{var S,v,b,w;const i=[],r=[];let e=0,n=!1;const t=a.eligibility||{};if(s.age!==void 0&&s.age!==null?t.minAge&&s.age<t.minAge?(r.push(`Min age is ${t.minAge} yrs`),n=!0):t.maxAge&&s.age>t.maxAge?(r.push(`Max age is ${t.maxAge} yrs`),n=!0):(t.minAge||t.maxAge)&&(e+=15,i.push(`Your age (${s.age}) meets the age requirement`)):(t.minAge||t.maxAge)&&(e+=5),t.gender&&t.gender!=="all"?s.gender&&s.gender!==t.gender?(r.push(`Scheme is for ${t.gender} applicants only`),n=!0):s.gender===t.gender&&(e+=15,i.push("Your gender matches the scheme requirement")):e+=5,t.states&&t.states.length>0){const d=p=>(p||"").toLowerCase().trim();s.state&&t.states.map(d).includes(d(s.state))?(e+=20,i.push(`Available in your state (${s.state})`)):s.state?(r.push(`Only available in: ${t.states.join(", ")}`),n=!0):e+=5}else e+=10,i.push("National scheme available across all states");if(t.maxAnnualIncome&&s.annualIncome!==void 0&&s.annualIncome!==null?s.annualIncome<=t.maxAnnualIncome?(e+=15,i.push(`Income within scheme limit (₹${t.maxAnnualIncome.toLocaleString("en-IN")})`)):(r.push(`Income exceeds limit of ₹${t.maxAnnualIncome.toLocaleString("en-IN")}`),n=!0):e+=5,t.occupations&&t.occupations.length>0?s.occupation&&t.occupations.includes(s.occupation)&&(e+=15,i.push(`Your occupation (${s.occupation.replace(/_/g," ")}) is eligible`)):e+=5,t.categories&&t.categories.length>0){const d=t.categories.map(p=>p.toLowerCase());s.category&&d.includes(s.category.toLowerCase())&&(e+=10,i.push(`Your category (${s.category.toUpperCase()}) is eligible`))}else e+=5;t.isFarmerRequired?s.isFarmer?(e+=15,i.push("You are a farmer — core requirement met")):(r.push("Requires farmer status"),n=!0):s.isFarmer&&((S=a.targetGroups)!=null&&S.includes("farmers"))&&(e+=8,i.push("Farmers are a target group")),t.isStudentRequired?s.isStudent?(e+=15,i.push("You are a student — requirement met")):(r.push("Requires student status"),n=!0):s.isStudent&&((v=a.targetGroups)!=null&&v.includes("students"))&&(e+=8,i.push("Students are a target group")),t.isSeniorCitizenRequired?s.isSeniorCitizen?(e+=15,i.push("Senior citizen status required — you qualify")):(r.push("Requires senior citizen status (60+)"),n=!0):s.isSeniorCitizen&&((b=a.targetGroups)!=null&&b.includes("senior_citizens"))&&(e+=8,i.push("Senior citizens are a target group")),t.hasDisabilityRequired&&(s.hasDisability?(e+=15,i.push("Your disability status qualifies")):(r.push("Requires disability status"),n=!0)),t.isBPLRequired&&(s.isBPL?(e+=10,i.push("BPL status matches requirement")):(r.push("Requires BPL card"),n=!0)),t.isWidowRequired&&(s.isWidow?(e+=15,i.push("Widow status qualifies")):(r.push("Scheme is for widows"),n=!0)),t.areaTypes&&t.areaTypes.length>0&&(s.areaType&&t.areaTypes.includes(s.areaType)?(e+=5,i.push(`Available for ${s.areaType.replace(/_/g," ")} areas`)):s.areaType&&r.push(`Only for: ${t.areaTypes.join(", ")}`)),(w=a.targetGroups)!=null&&w.includes("women")&&s.gender==="female"&&(e+=8,i.push("Scheme specifically supports women"));const m=Math.min(e,100);let u=null,h=!1;return n||(m>=75?(u="highly_relevant",h=!0):m>=50?(u="relevant",h=!0):m>=25&&(u="possibly_relevant",h=!0)),{matchScore:m,matchLevel:u,matchReasons:i,missedReasons:r,isMatch:h,hardFail:n}},R={getMatches(s){if(!s)return{total:0,results:{all:[],highlyRelevant:[],relevant:[],possiblyRelevant:[]}};const a=[];for(const n of o){if(n.status!=="active")continue;const t=I(s,n);t.isMatch&&a.push({id:n.id,slug:n.slug,name:n.name,department:n.department,category:n.category,shortDescription:n.shortDescription,mainBenefit:n.mainBenefit,benefits:n.benefits,targetGroups:n.targetGroups,applicationMode:n.applicationMode,fundingType:n.fundingType,matchScore:t.matchScore,matchLevel:t.matchLevel,matchReasons:t.matchReasons})}a.sort((n,t)=>t.matchScore-n.matchScore);const i=a.filter(n=>n.matchLevel==="highly_relevant"),r=a.filter(n=>n.matchLevel==="relevant"),e=a.filter(n=>n.matchLevel==="possibly_relevant");return{total:a.length,disclaimer:"These schemes are recommended based on the information you provided. Official eligibility must be confirmed with the relevant government department.",results:{all:a,highlyRelevant:i,relevant:r,possiblyRelevant:e}}},checkScheme(s,a){const i=y(s);return!i||!a?null:I(a,i)}},c=()=>{try{return JSON.parse(localStorage.getItem(A))||[]}catch{return[]}},g=s=>localStorage.setItem(A,JSON.stringify(s)),M={getAll(s){let a=c();return s&&(a=a.filter(i=>i.applicationStatus===s)),a.map(i=>({...i,scheme:y(i.schemeId)})).filter(i=>i.scheme)},save(s,a={}){const i=c();if(i.find(n=>n.schemeId===s)||!y(s))return;const e={id:`saved_${Date.now()}`,schemeId:s,applicationStatus:"saved",matchScore:a.matchScore||null,matchLevel:a.matchLevel||null,matchReasons:a.matchReasons||[],notes:"",savedAt:new Date().toISOString()};return g([...i,e]),e},unsave(s){g(c().filter(a=>a.schemeId!==s))},updateStatus(s,a){g(c().map(i=>i.schemeId===s?{...i,applicationStatus:a}:i))},updateNotes(s,a){g(c().map(i=>i.schemeId===s?{...i,notes:a}:i))},isSaved(s){return c().some(a=>a.schemeId===s)}},C=s=>{const a=s.toLowerCase();return/hello|hi|namaste|namaskar|help|start/i.test(a)?"greeting":/farmer|kisan|rythu|agriculture|krishi/i.test(a)?"farmer":/student|scholarship|padhai|chaduvulu|education/i.test(a)?"student":/women|mahila|stree|lady|female/i.test(a)?"women":/health|hospital|treatment|medical|arogya/i.test(a)?"health":/house|housing|home|awas|illu|ghar/i.test(a)?"housing":/disable|disability|divyang/i.test(a)?"disability":/old|senior|elderly|aged|pension|60/i.test(a)?"senior":/skill|training|course|certificate|vocational/i.test(a)?"skill":/loan|business|mudra|enterprise|entrepreneur/i.test(a)?"business":/document|papers|certificate|proof|what.*need/i.test(a)?"documents":/how.*apply|apply.*kaise|application/i.test(a)?"how_to_apply":/eligible|eligib|qualify|am i/i.test(a)?"eligibility":/what scheme|which scheme|find scheme|recommend|my scheme/i.test(a)?"find":/bpl|below poverty|ration card/i.test(a)?"bpl":"general"},l=s=>s.map(a=>`• **${a.name}**: ${a.mainBenefit||a.shortDescription}`).join(`
`),L={respond(s,a){switch(C(s)){case"greeting":return{message:`Namaste! 🙏 I'm SchemeMate Assistant.

I can help you:

• Find government schemes you may be eligible for
• Explain what documents you need
• Guide you through the application process
• Answer questions about specific schemes

What would you like to know?`,suggestions:["What schemes am I eligible for?","Show me farmer schemes","How do I apply for PM-KISAN?","What documents do I need?"]};case"farmer":{const r=o.filter(e=>{var n,t;return((n=e.eligibility)==null?void 0:n.isFarmerRequired)||((t=e.targetGroups)==null?void 0:t.includes("farmers"))}).slice(0,5);return{message:`Here are key schemes for **farmers**:

${l(r)}

Click any scheme to see full details, documents, and how to apply.

⚠️ *Confirm official eligibility with the relevant department.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["Documents needed for PM-KISAN?","What is Fasal Bima?","Show Kisan Credit Card"]}}case"student":{const r=o.filter(e=>{var n,t;return((n=e.eligibility)==null?void 0:n.isStudentRequired)||((t=e.targetGroups)==null?void 0:t.includes("students"))}).slice(0,5);return{message:`Here are schemes for **students**:

${l(r)}

These scholarships cover tuition, hostel, and living expenses for eligible students.

⚠️ *Verify eligibility on official portals.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["How to apply for NSP scholarship?","Income limit for scholarship?","Documents for NSP"]}}case"women":{const r=o.filter(e=>{var n,t;return((n=e.targetGroups)==null?void 0:n.includes("women"))||((t=e.eligibility)==null?void 0:t.gender)==="female"}).slice(0,5);return{message:`Here are schemes specially for **women**:

${l(r)}

These include maternity benefits, LPG connections, savings schemes, and business loans.

⚠️ *Always confirm eligibility with the relevant authority.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["PM Ujjwala Yojana documents?","Sukanya Samriddhi interest rate?","Stand Up India for women"]}}case"health":{const r=o.filter(e=>e.category==="healthcare").slice(0,4);return{message:`Here are **healthcare schemes**:

${l(r)}

Ayushman Bharat (PM-JAY) is the most comprehensive — it covers hospitalisation up to ₹5 lakh/year.

⚠️ *Eligibility depends on SECC 2011 data or state-level criteria.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["Am I eligible for Ayushman Bharat?","Ayushman Bharat documents?","How many hospitals?"]}}case"housing":{const r=o.filter(e=>e.category==="housing").slice(0,4);return{message:`Here are **housing schemes**:

${l(r)}

PMAY-Gramin offers ₹1.2 lakh for rural families. PMAY-Urban offers interest subsidy on home loans.

⚠️ *Check official portals for current status.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["PMAY Gramin eligibility?","PMAY Urban interest subsidy?","How to apply for PMAY?"]}}case"disability":{const r=o.filter(e=>{var n,t;return((n=e.eligibility)==null?void 0:n.hasDisabilityRequired)||((t=e.targetGroups)==null?void 0:t.includes("disabled"))}).slice(0,4);return{message:`Here are schemes for **persons with disabilities**:

${l(r)}

**IGNDPS** provides ₹300/month pension for severe disabilities. A disability certificate (80%+) is needed.

⚠️ *Confirm with District Social Welfare Officer.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["How to get disability certificate?","Disability pension eligibility?","Documents needed"]}}case"senior":{const r=o.filter(e=>{var n,t;return((n=e.eligibility)==null?void 0:n.isSeniorCitizenRequired)||((t=e.targetGroups)==null?void 0:t.includes("senior_citizens"))}).slice(0,4);return{message:`Here are schemes for **senior citizens (60+)**:

${l(r)}

**IGNOAPS** gives ₹200-500/month pension. Many states add their own top-up on top.

⚠️ *Apply at Gram Panchayat or Urban Local Body.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["Old age pension eligibility?","Documents for pension?","How much will I get?"]}}case"skill":{const r=o.filter(e=>e.category==="skill_development").slice(0,3);return{message:`Here are **skill development schemes**:

${l(r)}

**PMKVY** is the flagship scheme — free 3-12 month training with government certificate and monetary reward.

⚠️ *Find nearest centre at skillindia.gov.in.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["How to enrol in PMKVY?","PMKVY age limit?","Digital literacy training"]}}case"business":{const r=o.filter(e=>e.category==="entrepreneurship").slice(0,3);return{message:`Here are **business & loan schemes**:

${l(r)}

**PM MUDRA Yojana** gives loans up to ₹10 lakh without collateral. **Stand Up India** gives ₹10 lakh–₹1 crore for SC/ST and women.

⚠️ *Apply at any scheduled commercial bank.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["MUDRA loan eligibility?","Stand Up India for women?","Documents for MUDRA loan"]}}case"bpl":{const r=o.filter(e=>{var n,t;return((n=e.eligibility)==null?void 0:n.isBPLRequired)||((t=e.targetGroups)==null?void 0:t.includes("bpl_families"))}).slice(0,5);return{message:`Here are schemes for **BPL (Below Poverty Line) families**:

${l(r)}

Having a BPL card or being in SECC 2011 data unlocks many central government schemes.

⚠️ *Confirm with your local Gram Panchayat or Urban Local Body.*`,schemes:r.map(e=>({id:e.id,slug:e.slug,name:e.name})),suggestions:["How to get BPL card?","Ayushman Bharat for BPL?","PMAY for BPL families"]}}case"documents":return{message:`For most government schemes, you typically need:

• **Aadhaar Card** — mandatory for almost all schemes
• **Bank Account** (linked with Aadhaar) — for direct benefit transfers
• **Income Certificate** — from Tehsildar/SDM for income-based schemes
• **Caste Certificate** — for SC/ST/OBC-specific schemes
• **Land Records** — for farmer schemes like PM-KISAN
• **BPL Card / Ration Card** — for BPL-specific schemes

📌 Exact documents vary by scheme. Click on any scheme to see its specific document requirements.`,suggestions:["Farmer scheme documents?","Student scholarship documents?","Ayushman Bharat documents?"]};case"how_to_apply":return{message:`**How to apply** depends on the scheme. General steps:

1. **Check eligibility** — review criteria on the scheme page
2. **Gather documents** — Aadhaar, bank details, income proof etc.
3. **Visit official portal or CSC** — most schemes have online portals
4. **Common Service Centre (CSC)** — for offline applications in rural areas

💡 Find your nearest CSC at locator.csccloud.in

⚠️ Never pay anyone to apply — all government scheme applications are **FREE**.`,suggestions:["CSC centre nearby?","Documents needed generally?","Show me PM-KISAN application"]};case"eligibility":return a!=null&&a.isComplete?{message:`Based on your saved profile, I can show you personalised recommendations in **My Schemes** section.

Your profile shows:
• State: ${a.state||"Not set"}
• Occupation: ${(a.occupation||"").replace(/_/g," ")}
• Age: ${a.age||"Not set"}

Visit **My Schemes** to see all matched schemes with match scores and reasons.`,suggestions:["Show my matched schemes","Update my profile","Show all schemes"],action:{type:"navigate",path:"/my-schemes"}}:{message:`To check your specific eligibility, please complete your profile first. It only takes about 2 minutes!

I'll ask about your age, occupation, income, and location — then match you with the right government schemes.`,suggestions:["Complete my profile","Show all schemes","What schemes exist?"],action:{type:"navigate",path:"/onboarding"}};case"find":return a!=null&&a.isComplete?{message:`Great! Based on your profile, I've already matched you with relevant schemes. Go to **My Schemes** to see them.

You can filter by match level (Highly Relevant, Relevant, Possibly Relevant) and save schemes you want to track.`,suggestions:["Go to My Schemes","Show farmer schemes","Show healthcare schemes"],action:{type:"navigate",path:"/my-schemes"}}:{message:`To find schemes relevant to you, I need to know a bit about you first.

Please complete your profile — it only takes 2-3 minutes. I'll ask about your age, occupation, income, and location.`,suggestions:["Complete my profile now","Show all available schemes","Explore by category"],action:{type:"navigate",path:"/onboarding"}};default:return{message:`I can help you find government schemes! Here are some things you can ask me:

• "Show me farmer schemes"
• "What healthcare schemes are available?"
• "What documents do I need?"
• "How do I apply for Ayushman Bharat?"
• "Show housing schemes"

Or explore all ${o.length} schemes in the Explore section.`,suggestions:["Show farmer schemes","Healthcare schemes","Student scholarships","Business loans"]}}}};export{L as a,R as m,k as p,M as s};
