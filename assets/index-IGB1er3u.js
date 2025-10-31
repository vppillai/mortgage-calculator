import{D as Y}from"./decimal-CNRKZ6of.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const d={MAX_AMORTIZATION_HIGH_RATIO:300,MAX_AMORTIZATION_CONVENTIONAL:360,MIN_AMORTIZATION:12,MIN_INTEREST_RATE:.01,MAX_INTEREST_RATE:30,MIN_PRINCIPAL:1e3,MAX_PRINCIPAL:1e7,MIN_DOWN_PAYMENT_UNDER_500K:.05,MIN_DOWN_PAYMENT_500K_TO_1M:.1,MIN_DOWN_PAYMENT_OVER_1M:.2,PAYMENT_FREQUENCIES:{MONTHLY:"monthly",BI_WEEKLY:"bi-weekly",WEEKLY:"weekly"},PAYMENTS_PER_YEAR:{monthly:12,"bi-weekly":26,weekly:52},COMPOUNDING_PERIODS_PER_YEAR:2,PREPAYMENT_FREQUENCIES:{PER_PAYMENT:"per-payment",ANNUAL:"annual",ONE_TIME:"one-time"},MAX_COMPARISON_SCENARIOS:5,DEFAULT_PAYMENT_FREQUENCY:"monthly",STORAGE_KEYS:{SCENARIOS:"mortgage-calc-scenarios",COMPARISONS:"mortgage-calc-comparisons",PREFERENCES:"mortgage-calc-preferences",CURRENT:"mortgage-calc-current"},ERROR_CODES:{INVALID_PRINCIPAL:"INVALID_PRINCIPAL",INVALID_RATE:"INVALID_RATE",INVALID_TERM:"INVALID_TERM",CALCULATION_ERROR:"CALCULATION_ERROR",COMPARISON_FULL:"COMPARISON_FULL",STORAGE_ERROR:"STORAGE_ERROR"}};class K{constructor(){this.keys=d.STORAGE_KEYS}isAvailable(){try{const t="__storage_test__";return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch{return!1}}get(t){if(!this.isAvailable())return null;try{const e=localStorage.getItem(t);return e?JSON.parse(e):null}catch(e){return console.error(`Error reading from localStorage: ${t}`,e),null}}set(t,e){if(!this.isAvailable())return!1;try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch(a){return console.error(`Error writing to localStorage: ${t}`,a),!1}}remove(t){if(!this.isAvailable())return!1;try{return localStorage.removeItem(t),!0}catch(e){return console.error(`Error removing from localStorage: ${t}`,e),!1}}clear(){this.isAvailable()&&Object.values(this.keys).forEach(t=>{this.remove(t)})}saveScenarios(t){return this.set(this.keys.SCENARIOS,t)}getScenarios(){return this.get(this.keys.SCENARIOS)||[]}saveComparisons(t){return this.set(this.keys.COMPARISONS,t)}getComparisons(){return this.get(this.keys.COMPARISONS)||[]}savePreferences(t){return this.set(this.keys.PREFERENCES,t)}getPreferences(){return this.get(this.keys.PREFERENCES)||{theme:"system",locale:"en-CA",defaultPaymentFrequency:"monthly",showAdvancedOptions:!1}}saveCurrent(t){return this.set(this.keys.CURRENT,t)}getCurrent(){return this.get(this.keys.CURRENT)}}const U=new K;class X{constructor(){this.events={}}on(t,e){return this.events[t]||(this.events[t]=[]),this.events[t].push(e),()=>{this.events[t]=this.events[t].filter(a=>a!==e)}}once(t,e){const a=(...r)=>{e(...r),this.off(t,a)};this.on(t,a)}off(t,e){this.events[t]&&(this.events[t]=this.events[t].filter(a=>a!==e))}emit(t,e){this.events[t]&&this.events[t].forEach(a=>{try{a(e)}catch(r){console.error(`Error in event handler for ${t}:`,r)}})}clear(){this.events={}}listenerCount(t){return this.events[t]?this.events[t].length:0}}const y={CALCULATION_COMPLETE:"calculation:complete",THEME_CHANGED:"theme:changed",ERROR_OCCURRED:"error:occurred",NOTIFICATION:"notification:show"},p=new X,T={DEBUG:0,INFO:1,WARN:2,ERROR:3};class Z{constructor(){this.level=T.WARN,this.logs=[],this.maxLogs=100}setLevel(t){this.level=T[t]||T.INFO}debug(t,e){this.level<=T.DEBUG&&(console.debug(`[DEBUG] ${t}`,e||""),this.addLog("DEBUG",t,e))}info(t,e){this.level<=T.INFO&&(console.log(`[INFO] ${t}`,e||""),this.addLog("INFO",t,e))}warn(t,e){this.level<=T.WARN&&(console.warn(`[WARN] ${t}`,e||""),this.addLog("WARN",t,e))}error(t,e){this.level<=T.ERROR&&(console.error(`[ERROR] ${t}`,e||""),this.addLog("ERROR",t,e))}addLog(t,e,a){this.logs.push({level:t,message:e,data:a,timestamp:new Date().toISOString()}),this.logs.length>this.maxLogs&&this.logs.shift()}getLogs(){return[...this.logs]}clearLogs(){this.logs=[]}exportLogs(){return JSON.stringify(this.logs,null,2)}}const E=new Z;Y.set({precision:20,rounding:Y.ROUND_HALF_UP,toExpNeg:-7,toExpPos:21,minE:-9e15,maxE:9e15});function u(n){return new Y(n)}function A(n,t){return u(n).plus(u(t))}function h(n,t){return u(n).minus(u(t))}function L(n,t){return u(n).times(u(t))}function x(n,t){return u(n).dividedBy(u(t))}function M(n,t){return u(n).pow(u(t))}function f(n,t=2){return u(n).toDecimalPlaces(t).toNumber()}class Q extends Error{constructor(t,e){super(t),this.name="MortgageCalculatorError",this.code=e}}class J extends Q{constructor(t){super(t,d.ERROR_CODES.CALCULATION_ERROR),this.name="CalculationError"}}function B(n){try{const{principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:r}=n,s=x(e,100),i=x(s,2),o=d.PAYMENTS_PER_YEAR[r],m=A(1,i),l=h(M(m,2),1),_=A(1,l),k=h(M(_,x(1,o)),1),I=L(a,x(o,12)),O=A(1,k),C=M(O,I),b=L(k,C),$=h(C,1),v=L(t,x(b,$)),g=L(v,I),S=h(g,t),w=new Date,P=new Date(w);return P.setMonth(P.getMonth()+parseInt(a)),{regularPayment:f(v,2),totalPayments:f(I,0),totalInterest:f(S,2),totalCost:f(g,2),payoffDate:P.toISOString().split("T")[0],effectiveRate:f(k,6)}}catch(t){throw new J(`Failed to calculate mortgage: ${t.message}`)}}function tt(n){const{principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:r}=n,s=B(n),i=u(s.regularPayment),o=[];let m=u(t);const l=x(e,100),_=x(l,2),k=A(1,_),I=h(M(k,2),1),O=d.PAYMENTS_PER_YEAR[r],C=A(1,I),b=h(M(C,x(1,O)),1),$=Math.ceil(s.totalPayments),v=new Date;for(let g=1;g<=$;g++){const S=L(m,b),w=h(i,S);m=h(m,w),m.lessThan(0)&&(m=u(0));const P=new Date(v),H=Math.floor(g*12/O);if(P.setMonth(P.getMonth()+H),o.push({paymentNumber:g,paymentDate:P.toISOString().split("T")[0],principalPayment:f(w,2),interestPayment:f(S,2),totalPayment:f(i,2),remainingBalance:f(m,2)}),m.equals(0))break}return o}function V(n){const{principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:r,extraPayment:s,extraPaymentFrequency:i}=n,o=B({principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:r}),m=x(e,100),l=x(m,2),_=A(1,l),k=h(M(_,2),1),I=d.PAYMENTS_PER_YEAR[r],O=A(1,k),C=h(M(O,x(1,I)),1);let b=u(t);const $=u(o.regularPayment);let v=0,g=u(0);const S=1e4;for(;b.greaterThan(0)&&v<S;){v++;const D=L(b,C);g=A(g,D);let F=h($,D),q=u(0);(i==="per-payment"||i==="annual"&&v%I===0||i==="one-time"&&v===1)&&(q=u(s)),F=A(F,q),F.greaterThan(b)&&(F=b),b=h(b,F)}const w=Math.ceil(v/I*12),P=h(o.totalInterest,g),H=a-w;return{actualPayoffMonths:w,totalInterestSaved:f(P,2),monthsSaved:H,totalCostWithPrepayment:f(A(t,g),2),originalTotalCost:o.totalCost,savingsPercentage:f(x(P,o.totalInterest).times(100),2)}}const et=new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",minimumFractionDigits:2,maximumFractionDigits:2});function c(n){return n==null||isNaN(n)?"$0.00":et.format(n)}const R={PRINCIPAL_TOO_LOW:`Loan amount must be at least ${c(d.MIN_PRINCIPAL)}`,PRINCIPAL_TOO_HIGH:`Loan amount cannot exceed ${c(d.MAX_PRINCIPAL)}`,RATE_TOO_LOW:`Interest rate must be at least ${d.MIN_INTEREST_RATE}%`,RATE_TOO_HIGH:`Interest rate cannot exceed ${d.MAX_INTEREST_RATE}%`,TERM_TOO_SHORT:"Amortization period must be at least 1 year",TERM_TOO_LONG_HIGH_RATIO:"High-ratio mortgages (over 80% LTV) cannot exceed 25 years",TERM_TOO_LONG_CONVENTIONAL:"Conventional mortgages cannot exceed 30 years",INVALID_PAYMENT_FREQUENCY:"Please select a valid payment frequency"};function at(n){const t=[],e=[],a={},{principal:r,interestRate:s,amortizationMonths:i,paymentFrequency:o,isHighRatio:m}=n;if(r<d.MIN_PRINCIPAL){const l="PRINCIPAL_TOO_LOW";t.push(l),a.principal=R[l]}if(r>d.MAX_PRINCIPAL){const l="PRINCIPAL_TOO_HIGH";t.push(l),a.principal=R[l]}if(s<d.MIN_INTEREST_RATE){const l="RATE_TOO_LOW";t.push(l),a.interestRate=R[l]}if(s>d.MAX_INTEREST_RATE){const l="RATE_TOO_HIGH";t.push(l),a.interestRate=R[l]}if(i<d.MIN_AMORTIZATION){const l="TERM_TOO_SHORT";t.push(l),a.amortizationMonths=R[l]}if(m&&i>d.MAX_AMORTIZATION_HIGH_RATIO){const l="TERM_TOO_LONG_HIGH_RATIO";t.push(l),a.amortizationMonths=R[l]}else if(i>d.MAX_AMORTIZATION_CONVENTIONAL){const l="TERM_TOO_LONG_CONVENTIONAL";t.push(l),a.amortizationMonths=R[l]}if(!d.PAYMENTS_PER_YEAR[o]){const l="INVALID_PAYMENT_FREQUENCY";t.push(l),a.paymentFrequency=R[l]}return{isValid:t.length===0,errors:t,warnings:e,fieldErrors:a,errorMessages:t.map(l=>R[l]||l)}}function st(n){if(n=n.replace(/\s/g,""),!/^[0-9+\-*/().,]+$/.test(n))return null;n=n.replace(/,/g,"");try{const t=Function('"use strict"; return ('+n+")")();return typeof t=="number"&&!isNaN(t)&&isFinite(t)?Math.round(t*100)/100:null}catch{return null}}function rt(n){return/[+\-*/()]/.test(n)}function nt(n){if(!n||n.length===0)return"";try{const t=n.map(a=>{const r=[a.principal,Math.round(a.interestRate*100),a.amortizationMonths,a.paymentFrequency.charAt(0),a.extraPaymentAmount||0];return a.extraPaymentFrequency!=="per-payment"&&r.push(a.extraPaymentFrequency==="annual"?"a":"o"),r.join("|")}).join(";");return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}catch(t){return console.error("Error encoding scenarios:",t),""}}function it(n){if(!n)return[];try{const t=n.replace(/-/g,"+").replace(/_/g,"/")+"==".substring(0,(4-n.length%4)%4);return atob(t).split(";").map(r=>{const s=r.split("|");return{principal:parseFloat(s[0]),interestRate:parseFloat(s[1])/100,amortizationMonths:parseInt(s[2]),paymentFrequency:s[3]==="w"?"weekly":s[3]==="b"?"bi-weekly":"monthly",extraPaymentAmount:parseFloat(s[4])||0,extraPaymentFrequency:s[5]==="a"?"annual":s[5]==="o"?"one-time":"per-payment"}})}catch(t){return console.error("Error decoding scenarios:",t),[]}}function ot(n){const t=nt(n);return t?`${window.location.href.split("?")[0]}?s=${t}`:window.location.href.split("?")[0]}function lt(){const t=new URLSearchParams(window.location.search).get("s");return it(t)}function ct(){const n=new URL(window.location);n.searchParams.delete("s"),window.history.replaceState({},document.title,n.pathname)}async function dt(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0;{const t=document.createElement("textarea");t.value=n,t.style.position="fixed",t.style.left="-999999px",document.body.appendChild(t),t.select();const e=document.execCommand("copy");return document.body.removeChild(t),e}}catch(t){return console.error("Failed to copy to clipboard:",t),!1}}class mt{constructor(t){if(this.container=document.getElementById(t),!this.container){console.error(`Container with id '${t}' not found`);return}this.state={principal:298e3,interestRate:4.05,amortizationMonths:360,paymentFrequency:"weekly",targetPayment:null,extraPaymentAmount:0,extraPaymentFrequency:"per-payment"},this.result=null,this.prepaymentResult=null,this.scenarios=[],this.loadSharedScenarios(),this.render(),this.attachEventListeners(),this.calculateAll()}render(){var t;this.container.innerHTML=`
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          <!-- Main Calculator Panel -->
          <div class="lg:col-span-5">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Prepayment Calculator
              </h2>
              
              <div class="space-y-4">
                <!-- Loan Amount -->
                <div>
                  <label for="principal" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Loan Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id="principal"
                      name="principal"
                      value="${this.state.principal}"
                      min="1000"
                      max="${d.MAX_PRINCIPAL}"
                      step="1000"
                      aria-describedby="principal-help principal-error"
                      aria-invalid="false"
                      aria-label="Loan amount in dollars"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p id="principal-help" class="sr-only">Enter the total loan amount between $1,000 and ${c(d.MAX_PRINCIPAL)}</p>
                  <p id="principal-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                </div>

                <!-- Interest Rate & Amortization -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="interestRate" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Interest Rate
                    </label>
                    <div class="relative">
                      <input
                        type="number"
                        id="interestRate"
                        name="interestRate"
                        value="${this.state.interestRate}"
                        min="0.01"
                        max="30"
                        step="0.01"
                        aria-describedby="interest-help interest-error"
                        aria-invalid="false"
                        aria-label="Annual interest rate percentage"
                        class="w-full pr-8 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">%</span>
                    </div>
                    <p id="interest-help" class="sr-only">Enter annual interest rate between 0.01% and 30%</p>
                    <p id="interest-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  </div>
                  
                  <div>
                    <label for="amortizationYears" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Amortization <span class="text-xs font-normal text-gray-500">(years)</span>
                    </label>
                    <input
                      type="number"
                      id="amortizationYears"
                      name="amortizationYears"
                      value="${this.state.amortizationMonths/12}"
                      min="1"
                      max="30"
                      step="1"
                      placeholder="Years"
                      aria-describedby="amortization-help amortization-error"
                      aria-invalid="false"
                      aria-label="Amortization period in years"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <p id="amortization-help" class="sr-only">Enter amortization period between 1 and 30 years</p>
                    <p id="amortization-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  </div>
                </div>

                <!-- Payment Frequency -->
                <div>
                  <label for="paymentFrequency" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Payment Frequency
                  </label>
                  <select 
                    id="paymentFrequency"
                    name="paymentFrequency"
                    aria-describedby="frequency-help"
                    aria-label="Payment frequency"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="weekly" ${this.state.paymentFrequency==="weekly"?"selected":""}>Weekly (52/year)</option>
                    <option value="bi-weekly" ${this.state.paymentFrequency==="bi-weekly"?"selected":""}>Bi-weekly (26/year)</option>
                    <option value="monthly" ${this.state.paymentFrequency==="monthly"?"selected":""}>Monthly (12/year)</option>
                  </select>
                  <p id="frequency-help" class="sr-only">Select how often you will make payments</p>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-200 dark:border-gray-700 my-4" role="separator" aria-label="Prepayment options section"></div>
                
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white" id="prepayment-heading">Prepayment Options</h3>

                <!-- Extra Payment -->
                <div>
                  <label for="extraPayment" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Extra Payment Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" aria-hidden="true">$</span>
                    <input
                      type="text"
                      id="extraPayment"
                      name="extraPayment"
                      value="${this.state.extraPaymentAmount||""}"
                      placeholder="e.g., 100 or (1200/12)+50"
                      aria-describedby="extra-help extra-error extra-warning"
                      aria-invalid="false"
                      aria-label="Extra payment amount or mathematical expression"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p id="extra-help" class="text-xs text-gray-500 mt-1">Enter amount or expression (e.g., 1200/12 or 50+25). Press Enter to calculate.</p>
                  <p id="extra-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  <p id="extra-warning" class="text-xs text-yellow-600 dark:text-yellow-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  ${this.state.extraPaymentAmount<0?'<p class="text-xs text-red-600 dark:text-red-400 mt-1" id="extra-error-display" role="alert">Amount must be positive</p>':this.state.extraPaymentAmount>((t=this.result)==null?void 0:t.regularPayment)*2?'<p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1" id="extra-warning-display" role="alert">Warning: Extra payment is very high</p>':""}
                </div>

                <!-- Extra Payment Type -->
                <div>
                  <label for="extraPaymentFrequency" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Extra Payment Type
                  </label>
                  <select 
                    id="extraPaymentFrequency"
                    name="extraPaymentFrequency"
                    aria-describedby="extra-type-help"
                    aria-label="How often to apply extra payment"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="per-payment">Each Payment</option>
                    <option value="annual">Annual Lump Sum</option>
                    <option value="one-time">One-time Payment</option>
                  </select>
                  <p id="extra-type-help" class="sr-only">Select when to apply the extra payment</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Panel -->
          <div class="lg:col-span-7">
            <div class="space-y-6">
              <!-- Base Mortgage -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Base Mortgage</h3>
                <div id="base-mortgage-results" role="region" aria-live="polite" aria-atomic="true">
                  ${this.renderMainResults()}
                </div>
                <div id="calculation-loading" class="hidden text-center py-4">
                  <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" role="status" aria-label="Calculating">
                    <span class="sr-only">Calculating...</span>
                  </div>
                  <p class="text-sm text-gray-500 mt-2">Calculating...</p>
                </div>
              </div>

              <!-- Prepayment Impact Section -->
              <div id="prepayment-section">
                ${this.prepaymentResult&&this.state.extraPaymentAmount>0?`
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-4 sm:p-6">
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-900 dark:text-green-100">
                      Prepayment Impact
                    </h3>
                    ${this.renderPrepaymentImpact()}
                  </div>
                `:""}
              </div>

              <!-- Comparison Table -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Scenario Comparison
                  </h3>
                  <div class="flex gap-2">
                    ${this.scenarios.length>0?`
                      <button id="share-scenarios" class="btn btn-secondary btn-sm text-xs sm:text-sm" aria-label="Share comparison scenarios via link" title="Share scenarios (Ctrl+S)">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Share
                      </button>
                    `:""}
                    <button id="add-to-comparison" class="btn btn-primary btn-sm text-xs sm:text-sm" aria-label="Add current scenario to comparison">
                      + Add Current
                    </button>
                  </div>
                </div>
                <div id="inline-comparison-table" class="overflow-x-auto -mx-4 sm:mx-0">
                  <div class="px-4 sm:px-0 min-w-full">
                    ${this.renderComparisonTable()}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button id="view-schedule" class="btn btn-secondary flex-1 text-sm sm:text-base" aria-label="View detailed amortization schedule">
                  View Amortization Schedule
                </button>
                <button id="reset" class="btn btn-secondary text-sm sm:text-base" aria-label="Reset calculator to default values (Ctrl+R)" title="Reset (Ctrl+R)">
                  Reset Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}renderMainResults(){return this.result?`
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">${this.state.paymentFrequency} Payment</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${c(this.result.regularPayment)}
          </div>
          <div class="text-xs text-gray-500">${d.PAYMENTS_PER_YEAR[this.state.paymentFrequency]} payments/year</div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Interest</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${c(this.result.totalInterest)}
          </div>
          <div class="text-xs text-gray-500">${(this.result.totalInterest/this.state.principal*100).toFixed(1)}% of principal</div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${c(this.result.totalCost)}
          </div>
          <div class="text-xs text-gray-500">${this.state.amortizationMonths/12} year term</div>
        </div>
      </div>
    `:`
        <div class="text-center py-8 text-gray-500">
          <p>Enter your mortgage details to see payment information</p>
        </div>
      `}renderTargetPaymentAnalysis(){const t=parseFloat(this.state.targetPayment);if(!t||!this.result)return"";const e=t-this.result.regularPayment,a=(e/this.result.regularPayment*100).toFixed(1);if(Math.abs(e)<1)return`
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200">
            ✓ Your target payment matches the calculated payment!
          </p>
        </div>
      `;const r=e>=0;return`
      <div class="mt-4 p-3 ${r?"bg-green-50 dark:bg-green-900/20":"bg-red-50 dark:bg-red-900/20"} rounded-lg">
        <p class="text-sm ${r?"text-green-800 dark:text-green-200":"text-red-800 dark:text-red-200"}">
          ${r?`✓ You can afford this mortgage! Your target is ${c(Math.abs(e))} (${Math.abs(a)}%) higher.`:`✗ Target payment is ${c(Math.abs(e))} (${Math.abs(a)}%) below required.`}
        </p>
        ${r&&e>10?`
          <p class="text-xs mt-1 ${r?"text-green-700 dark:text-green-300":"text-red-700 dark:text-red-300"}">
            Consider adding ${c(e)} as extra payment to pay off faster!
          </p>
        `:""}
      </div>
    `}renderPrepaymentImpact(){if(!this.result)return`
          <div class="text-center py-8 text-gray-500">
            <p>Calculate your mortgage to see prepayment options</p>
          </div>
        `;if(!this.prepaymentResult||this.state.extraPaymentAmount<=0)return`
          <div class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Add extra payments to see how much you can save
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div class="font-semibold text-gray-700 dark:text-gray-300">Weekly +$50</div>
                <div class="text-gray-500 dark:text-gray-400">Save ~22% interest</div>
              </div>
              <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div class="font-semibold text-gray-700 dark:text-gray-300">Weekly +$100</div>
                <div class="text-gray-500 dark:text-gray-400">Save ~36% interest</div>
              </div>
              <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div class="font-semibold text-gray-700 dark:text-gray-300">Annual $5,000</div>
                <div class="text-gray-500 dark:text-gray-400">Save ~30% interest</div>
              </div>
            </div>
          </div>
        `;const t=this.prepaymentResult,e=Math.floor(t.monthsSaved/12),a=t.monthsSaved%12,r=this.state.extraPaymentFrequency==="per-payment"?this.result.regularPayment+this.state.extraPaymentAmount:this.result.regularPayment,s=Math.floor(t.actualPayoffMonths/12),i=t.actualPayoffMonths%12,o=Math.floor(this.state.amortizationMonths/12),m=this.state.amortizationMonths%12;return`
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">New Payment</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${c(r)}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              ${this.state.paymentFrequency==="weekly"?"Weekly":this.state.paymentFrequency==="bi-weekly"?"Bi-weekly":"Monthly"}
            </div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Interest Saved</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${c(t.totalInterestSaved)}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">${t.savingsPercentage}% saved</div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Time Saved</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${e}y ${a}m
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              ${Math.round(t.monthsSaved/this.state.amortizationMonths*100)}% faster
            </div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Payoff Time</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${s}y ${i}m
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              vs ${o}y ${m}m
            </div>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-green-200/50 dark:bg-green-900/50 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200 text-center">
            💡 Adding ${c(this.state.extraPaymentAmount)} ${this.state.extraPaymentFrequency==="per-payment"?"to each payment":this.state.extraPaymentFrequency==="annual"?"annually":"once"} 
            saves ${c(t.totalInterestSaved)} and ${e} years ${a} months!
          </p>
        </div>
    `}renderComparisonTable(){return this.scenarios.length===0?`
                <div class="text-center py-8 text-gray-500" role="status" aria-live="polite">
                    <p class="mb-2">No scenarios added yet.</p>
                    <p class="text-sm">Click "+ Add Current" to compare different prepayment strategies.</p>
                </div>
            `:`
            <div class="overflow-x-auto max-h-96 overflow-y-auto" role="region" aria-label="Comparison table of mortgage scenarios">
                <table class="w-full text-sm min-w-[600px]" role="table" aria-label="Mortgage scenario comparison">
                    <thead class="sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <th scope="col" class="text-left py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Scenario</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Payment amount per period">Payment</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell" title="Total interest paid over loan term">Interest</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Total amount paid including principal and interest">Total Cost</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Time to pay off the mortgage">Time</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Savings compared to base scenario">Savings</th>
                            <th scope="col" class="text-center py-2 px-2 sm:px-3" aria-label="Remove scenario"><span class="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.scenarios.map((t,e)=>`
                            <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td class="py-2 px-2 sm:px-3">
                                    <div class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                        ${t.name}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        ${c(t.principal)} @ ${t.interestRate}%
                                        ${t.extraPaymentAmount>0?` • +${c(t.extraPaymentAmount)}`:""}
                                    </div>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap">
                                    <div class="text-xs sm:text-sm">${c(t.totalPayment)}</div>
                                    <div class="text-xs text-gray-500" aria-label="Payment frequency">
                                        ${t.paymentFrequency==="weekly"?"W":t.paymentFrequency==="bi-weekly"?"B":"M"}
                                    </div>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap hidden sm:table-cell">
                                    <span class="text-xs sm:text-sm">${c(t.totalInterest)}</span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <span class="text-xs sm:text-sm">${c(t.totalCost)}</span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap">
                                    <span class="text-xs sm:text-sm" aria-label="${Math.floor(t.payoffMonths/12)} years and ${t.payoffMonths%12} months">
                                        ${Math.floor(t.payoffMonths/12)}y ${t.payoffMonths%12}m
                                    </span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3">
                                    ${(()=>{if(t.savings>0){const a=this.scenarios[0],s=(a?a.payoffMonths:t.amortizationMonths)-t.payoffMonths,i=Math.floor(s/12),o=s%12;return`
                                                <div>
                                                    <div class="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm">
                                                        ${c(t.savings)}
                                                    </div>
                                                    ${s>0?`
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">
                                                            ${i}y ${o}m saved
                                                        </div>
                                                    `:""}
                                                </div>
                                            `}return'<span class="text-gray-500 text-xs sm:text-sm">-</span>'})()}
                                </td>
                                <td class="text-center py-2 px-2 sm:px-3">
                                    <button 
                                        class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded" 
                                        onclick="window.removeScenario(${e})"
                                        aria-label="Remove ${t.name} from comparison">
                                        <span aria-hidden="true">✕</span>
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <div class="sm:hidden mt-2 px-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>💡 Swipe horizontally to see all columns</p>
                </div>
            </div>
        `}attachEventListeners(){["principal","interestRate","amortizationYears","paymentFrequency","extraPayment","extraPaymentFrequency"].forEach(s=>{const i=document.getElementById(s);i&&(i.addEventListener("input",o=>{this.handleInputChange(o),this.validateInput(s,o.target.value),this.calculateAll()}),i.tagName==="SELECT"&&i.addEventListener("change",o=>{this.handleInputChange(o),this.calculateAll()}),s==="extraPayment"&&(i.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),this.evaluateExtraPayment())}),i.addEventListener("blur",()=>{this.evaluateExtraPayment()})))});const e=document.getElementById("reset");e&&e.addEventListener("click",()=>this.handleReset());const a=document.getElementById("add-to-comparison");a&&a.addEventListener("click",()=>this.addToComparison()),window.removeScenario=s=>{this.scenarios.splice(s,1),this.updateComparisonSection(),this.attachShareButtonListener()},this.attachShareButtonListener();const r=document.getElementById("view-schedule");r&&r.addEventListener("click",()=>{this.result?p.emit("schedule:show",this.state):p.emit(y.NOTIFICATION,{message:"Please enter mortgage details first",type:"info"})}),document.addEventListener("keydown",s=>{(s.ctrlKey||s.metaKey)&&s.key==="r"&&!s.shiftKey&&!s.altKey&&(s.preventDefault(),this.handleReset()),(s.ctrlKey||s.metaKey)&&s.key==="s"&&!s.shiftKey&&!s.altKey&&this.scenarios.length>0&&(s.preventDefault(),this.shareScenarios())})}handleInputChange(t){const{id:e,value:a}=t.target;switch(e){case"principal":this.state.principal=parseFloat(a)||0;break;case"interestRate":this.state.interestRate=parseFloat(a)||0;break;case"amortizationYears":this.state.amortizationMonths=(parseInt(a)||0)*12;break;case"paymentFrequency":this.state.paymentFrequency=a;break;case"targetPayment":this.state.targetPayment=a?parseFloat(a):null;break;case"extraPayment":break;case"extraPaymentFrequency":this.state.extraPaymentFrequency=a;break}}validateInput(t,e){const a=document.getElementById(`${t}-error`),r=document.getElementById(t);if(!a||!r)return;let s="";switch(t){case"principal":{const i=parseFloat(e)||0;i<d.MIN_PRINCIPAL?(s=`Loan amount must be at least ${c(d.MIN_PRINCIPAL)}`,r.setAttribute("aria-invalid","true")):i>d.MAX_PRINCIPAL?(s=`Loan amount must not exceed ${c(d.MAX_PRINCIPAL)}`,r.setAttribute("aria-invalid","true")):r.setAttribute("aria-invalid","false");break}case"interestRate":{const i=parseFloat(e)||0;i<.01?(s="Interest rate must be at least 0.01%",r.setAttribute("aria-invalid","true")):i>30?(s="Interest rate must not exceed 30%",r.setAttribute("aria-invalid","true")):r.setAttribute("aria-invalid","false");break}case"amortizationYears":{const i=parseInt(e)||0;i<1?(s="Amortization must be at least 1 year",r.setAttribute("aria-invalid","true")):i>30?(s="Amortization must not exceed 30 years",r.setAttribute("aria-invalid","true")):r.setAttribute("aria-invalid","false");break}}s?(a.textContent=s,a.classList.remove("hidden")):(a.classList.add("hidden"),a.textContent="")}updateValidationErrors(t){t.errors.forEach(e=>{let a="",r="";switch(e){case"PRINCIPAL_TOO_LOW":a="principal",r=`Loan amount must be at least ${c(d.MIN_PRINCIPAL)}`;break;case"PRINCIPAL_TOO_HIGH":a="principal",r=`Loan amount must not exceed ${c(d.MAX_PRINCIPAL)}`;break;case"RATE_TOO_LOW":a="interestRate",r="Interest rate must be at least 0.01%";break;case"RATE_TOO_HIGH":a="interestRate",r="Interest rate must not exceed 30%";break;case"TERM_TOO_SHORT":a="amortizationYears",r="Amortization must be at least 1 year";break;case"TERM_TOO_LONG_CONVENTIONAL":case"TERM_TOO_LONG_HIGH_RATIO":a="amortizationYears",r="Amortization must not exceed 30 years for conventional mortgages";break}if(a){const s=document.getElementById(`${a}-error`),i=document.getElementById(a);s&&(s.textContent=r,s.classList.remove("hidden")),i&&i.setAttribute("aria-invalid","true")}})}clearValidationErrors(){["principal","interestRate","amortizationYears"].forEach(e=>{const a=document.getElementById(`${e}-error`),r=document.getElementById(e);a&&(a.classList.add("hidden"),a.textContent=""),r&&r.setAttribute("aria-invalid","false")})}calculateAll(){clearTimeout(this.calculationTimeout),this.calculationTimeout=setTimeout(()=>{this.performCalculations()},300)}performCalculations(){const t=document.getElementById("calculation-loading"),e=document.getElementById("base-mortgage-results");t&&e&&(t.classList.remove("hidden"),e.setAttribute("aria-busy","true"));const a=at(this.state);if(!a.isValid){this.result=null,this.prepaymentResult=null,this.updateValidationErrors(a),t&&t.classList.add("hidden"),e&&e.setAttribute("aria-busy","false"),this.updateResults();return}this.clearValidationErrors(),requestAnimationFrame(()=>{try{this.result=B(this.state),this.state.extraPaymentAmount>0?this.prepaymentResult=V({...this.state,extraPayment:this.state.extraPaymentAmount,extraPaymentFrequency:this.state.extraPaymentFrequency}):this.prepaymentResult=null,this.updateResults(),t&&t.classList.add("hidden"),e&&e.setAttribute("aria-busy","false"),p.emit(y.CALCULATION_COMPLETE,{inputs:this.state,result:this.result,prepaymentResult:this.prepaymentResult})}catch(r){E.error("Calculation failed",r),this.result=null,this.prepaymentResult=null,t&&t.classList.add("hidden"),e&&e.setAttribute("aria-busy","false"),this.updateResults(),p.emit(y.ERROR_OCCURRED,r)}})}updateResults(){const t=document.querySelector("#base-mortgage-results");t&&(t.innerHTML=this.renderMainResults());const e=document.querySelector("#prepayment-section");e&&(this.prepaymentResult&&this.state.extraPaymentAmount>0?e.innerHTML=`
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-900 dark:text-green-100">
              Prepayment Impact
            </h3>
            ${this.renderPrepaymentImpact()}
          </div>
        `:e.innerHTML="");const a=document.querySelector("#inline-comparison-table");a&&(a.innerHTML=this.renderComparisonTable())}updateComparisonSection(){const t=document.querySelector("#inline-comparison-table");if(!t)return;const e=t.closest(".bg-white.dark\\:bg-gray-800.rounded-xl.shadow-lg");if(e){e.innerHTML=`
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Scenario Comparison
                  </h3>
                  <div class="flex gap-2">
                    ${this.scenarios.length>0?`
                      <button id="share-scenarios" class="btn btn-secondary btn-sm text-xs sm:text-sm" aria-label="Share comparison scenarios via link" title="Share scenarios (Ctrl+S)">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Share
                      </button>
                    `:""}
                    <button id="add-to-comparison" class="btn btn-primary btn-sm text-xs sm:text-sm" aria-label="Add current scenario to comparison">
                      + Add Current
                    </button>
                  </div>
                </div>
                <div id="inline-comparison-table" class="overflow-x-auto -mx-4 sm:mx-0">
                  <div class="px-4 sm:px-0 min-w-full">
                    ${this.renderComparisonTable()}
                  </div>
                </div>
            `;const a=document.getElementById("add-to-comparison");a&&a.addEventListener("click",()=>this.addToComparison())}}handleReset(){this.state={principal:298e3,interestRate:4.05,amortizationMonths:360,paymentFrequency:"weekly",targetPayment:null,extraPaymentAmount:0,extraPaymentFrequency:"per-payment"},this.result=null,this.prepaymentResult=null,this.render(),this.attachEventListeners(),this.calculateAll()}evaluateExtraPayment(){const t=document.getElementById("extraPayment");if(!t)return;const e=t.value.trim();if(!e){this.state.extraPaymentAmount=0,this.calculateAll();return}if(rt(e)){const a=st(e);a!==null?a<0?(p.emit(y.NOTIFICATION,{message:`${e} = ${a} (must be positive)`,type:"error"}),this.state.extraPaymentAmount=0,t.value=0):(this.state.extraPaymentAmount=a,t.value=a,this.calculateAll(),p.emit(y.NOTIFICATION,{message:`Calculated: ${e} = ${a}`,type:"info"})):p.emit(y.NOTIFICATION,{message:"Invalid expression. Use numbers and +, -, *, /, ()",type:"error"})}else{const a=parseFloat(e);!isNaN(a)&&a>=0?(this.state.extraPaymentAmount=a,this.calculateAll()):a<0&&(this.state.extraPaymentAmount=0,t.value=0,p.emit(y.NOTIFICATION,{message:"Extra payment must be positive",type:"error"}))}}addToComparison(){if(!this.result)return;let t=this.result.regularPayment;this.state.extraPaymentAmount>0&&this.state.extraPaymentFrequency==="per-payment"&&(t+=this.state.extraPaymentAmount);let e="";if(this.scenarios.length===0)e="Base Scenario";else{const s=this.scenarios[0],i=[];this.state.principal!==s.principal&&i.push(`${c(this.state.principal)}`),this.state.interestRate!==s.interestRate&&i.push(`${this.state.interestRate}%`),this.state.amortizationMonths!==s.amortizationMonths&&i.push(`${this.state.amortizationMonths/12}yr`),this.state.paymentFrequency!==s.paymentFrequency&&i.push(this.state.paymentFrequency),this.state.extraPaymentAmount>0&&i.push(`+${c(this.state.extraPaymentAmount)}`),e=i.length>0?i.join(", "):"Scenario "+(this.scenarios.length+1)}const a={name:e,basePayment:this.result.regularPayment,totalPayment:t,extraPaymentAmount:this.state.extraPaymentAmount,extraPaymentFrequency:this.state.extraPaymentFrequency,totalInterest:this.prepaymentResult&&this.state.extraPaymentAmount>0?this.result.totalInterest-this.prepaymentResult.totalInterestSaved:this.result.totalInterest,totalCost:this.prepaymentResult&&this.state.extraPaymentAmount>0?this.prepaymentResult.totalCostWithPrepayment:this.result.totalCost,payoffMonths:this.prepaymentResult&&this.state.extraPaymentAmount>0&&this.prepaymentResult.actualPayoffMonths?this.prepaymentResult.actualPayoffMonths:this.state.amortizationMonths,savings:0,principal:this.state.principal,interestRate:this.state.interestRate,amortizationMonths:this.state.amortizationMonths,paymentFrequency:this.state.paymentFrequency};if(this.scenarios.some(s=>s.principal===a.principal&&s.interestRate===a.interestRate&&s.amortizationMonths===a.amortizationMonths&&s.paymentFrequency===a.paymentFrequency&&s.extraPaymentAmount===a.extraPaymentAmount&&s.extraPaymentFrequency===a.extraPaymentFrequency))p.emit(y.NOTIFICATION,{message:"This scenario already exists in comparison",type:"info"});else{if(this.scenarios.push(a),this.scenarios.length>1){const s=this.scenarios[0];this.scenarios.forEach(i=>{i.savings=s.totalCost-i.totalCost})}this.updateComparisonSection(),p.emit(y.NOTIFICATION,{message:"Added to comparison!",type:"success"}),this.attachShareButtonListener()}}loadSharedScenarios(){try{const t=lt();if(t&&t.length>0){if(this.scenarios=[],t.forEach((e,a)=>{const r=B({principal:e.principal,interestRate:e.interestRate,amortizationMonths:e.amortizationMonths,paymentFrequency:e.paymentFrequency});let s=null;e.extraPaymentAmount>0&&(s=V({principal:e.principal,interestRate:e.interestRate,amortizationMonths:e.amortizationMonths,paymentFrequency:e.paymentFrequency,extraPayment:e.extraPaymentAmount,extraPaymentFrequency:e.extraPaymentFrequency}));let i=a===0?"Base Mortgage":"";if(a>0){const m=t[0],l=[];e.principal!==m.principal&&l.push(`${c(e.principal)} loan`),e.interestRate!==m.interestRate&&l.push(`${e.interestRate}% rate`),e.amortizationMonths!==m.amortizationMonths&&l.push(`${e.amortizationMonths/12}yr`),e.paymentFrequency!==m.paymentFrequency&&l.push(e.paymentFrequency),e.extraPaymentAmount>0&&l.push(`+${c(e.extraPaymentAmount)}`),i=l.slice(0,2).join(", ")}else e.extraPaymentAmount>0&&(i=`Base + ${c(e.extraPaymentAmount)}`);const o={name:i,principal:e.principal,interestRate:e.interestRate,amortizationMonths:e.amortizationMonths,paymentFrequency:e.paymentFrequency,extraPaymentAmount:e.extraPaymentAmount,extraPaymentFrequency:e.extraPaymentFrequency,regularPayment:r.regularPayment,totalPayment:r.regularPayment+(e.extraPaymentAmount||0),totalInterest:(s==null?void 0:s.totalInterest)||r.totalInterest,totalCost:(s==null?void 0:s.totalCost)||r.totalCost,payoffMonths:(s==null?void 0:s.actualPayoffMonths)||e.amortizationMonths,savings:0};this.scenarios.push(o)}),this.scenarios.length>0){const e=this.scenarios[0];this.scenarios.forEach(a=>{a.savings=e.totalCost-a.totalCost})}if(t[0]){const e=t[0];this.state.principal=e.principal,this.state.interestRate=e.interestRate,this.state.amortizationMonths=e.amortizationMonths,this.state.paymentFrequency=e.paymentFrequency,this.state.extraPaymentAmount=e.extraPaymentAmount||0,this.state.extraPaymentFrequency=e.extraPaymentFrequency||"per-payment"}ct(),p.emit(y.NOTIFICATION,{message:`Loaded ${t.length} shared scenario${t.length>1?"s":""}!`,type:"success"})}}catch(t){E.error("Failed to load shared scenarios:",t)}}attachShareButtonListener(){const t=document.getElementById("share-scenarios");t&&t.addEventListener("click",()=>this.shareScenarios())}async shareScenarios(){if(this.scenarios.length===0){p.emit(y.NOTIFICATION,{message:"No scenarios to share",type:"info"});return}try{const t=ot(this.scenarios);await dt(t)?p.emit(y.NOTIFICATION,{message:"Share link copied to clipboard!",type:"success"}):prompt("Copy this link to share:",t)}catch(t){E.error("Failed to generate share link:",t),p.emit(y.NOTIFICATION,{message:"Failed to generate share link",type:"error"})}}}class ut{constructor(t){this.container=document.getElementById(t),this.schedule=[],this.pageSize=50,this.currentPage=0}show(t){this.schedule=tt(t),this.currentPage=0,this.render()}render(){if(this.schedule.length===0){this.container.innerHTML="";return}const t=this.currentPage*this.pageSize,e=Math.min(t+this.pageSize,this.schedule.length),a=this.schedule.slice(t,e);this.container.innerHTML=`
      <div class="card mt-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Amortization Schedule
          </h3>
          <button id="close-schedule" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕ Close
          </button>
        </div>

        <div class="mb-4 flex justify-between items-center">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing payments ${t+1}-${e} of ${this.schedule.length}
          </div>
          <div class="flex gap-2">
            <button id="prev-page" class="btn btn-secondary text-sm" ${this.currentPage===0?"disabled":""}>
              Previous
            </button>
            <button id="next-page" class="btn btn-secondary text-sm" ${e>=this.schedule.length?"disabled":""}>
              Next
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Principal</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Interest</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              ${a.map(r=>`
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${r.paymentNumber}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    ${r.paymentDate}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ${c(r.principalPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ${c(r.interestPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    ${c(r.totalPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right ${r.remainingBalance===0?"text-green-600 dark:text-green-400 font-bold":"text-gray-900 dark:text-white"}">
                    ${c(r.remainingBalance)}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <button id="download-schedule" class="btn btn-secondary text-sm">
            Download CSV
          </button>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Page ${this.currentPage+1} of ${Math.ceil(this.schedule.length/this.pageSize)}
          </div>
        </div>
      </div>
    `,this.attachEventListeners()}attachEventListeners(){const t=document.getElementById("close-schedule");t&&t.addEventListener("click",()=>{this.container.innerHTML=""});const e=document.getElementById("prev-page");e&&e.addEventListener("click",()=>{this.currentPage>0&&(this.currentPage--,this.render())});const a=document.getElementById("next-page");a&&a.addEventListener("click",()=>{const s=Math.ceil(this.schedule.length/this.pageSize)-1;this.currentPage<s&&(this.currentPage++,this.render())});const r=document.getElementById("download-schedule");r&&r.addEventListener("click",()=>{this.downloadCSV()})}downloadCSV(){const t=["Payment #","Date","Principal","Interest","Total Payment","Remaining Balance"],e=this.schedule.map(o=>[o.paymentNumber,o.paymentDate,o.principalPayment,o.interestPayment,o.totalPayment,o.remainingBalance]),a=[t.join(","),...e.map(o=>o.join(","))].join(`
`),r=new Blob([a],{type:"text/csv"}),s=URL.createObjectURL(r),i=document.createElement("a");i.href=s,i.download=`amortization-schedule-${new Date().toISOString().split("T")[0]}.csv`,i.click(),URL.revokeObjectURL(s)}}class pt{constructor(){this.modalId="info-modal",this.isOpen=!1,this.render(),this.attachEventListeners()}render(){const t=document.createElement("div");t.id=this.modalId,t.className="fixed inset-0 z-50 hidden",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-labelledby","modal-title"),t.setAttribute("aria-describedby","modal-description"),t.innerHTML=`
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" id="modal-backdrop" aria-hidden="true"></div>
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                    <h3 id="modal-title" class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                                        How This Calculator Works
                                    </h3>
                                    <div id="modal-description" class="sr-only">Information about how the mortgage calculator works and calculation methods</div>
                                    
                                    <div class="mt-4 space-y-6 text-sm text-gray-700 dark:text-gray-300">
                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">📊 Calculation Method</h4>
                                            <p class="mb-3">This calculator uses the standard mortgage payment formula:</p>
                                            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                                PMT = P × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]
                                            </div>
                                            <ul class="mt-3 space-y-2 ml-4">
                                                <li>• PMT = Regular payment amount</li>
                                                <li>• P = Principal loan amount</li>
                                                <li>• r = Interest rate per payment period</li>
                                                <li>• n = Total number of payments</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">🏦 Interest Compounding</h4>
                                            <p>By default, this calculator uses <strong>semi-annual compounding</strong>, which is standard in Canada. The interest rate is compounded twice per year and then converted to the payment frequency you select.</p>
                                            <p class="mt-2">For other regions, you may need to adjust calculations based on local standards (e.g., monthly compounding in the US).</p>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">💰 Prepayment Calculations</h4>
                                            <p>When you add extra payments:</p>
                                            <ul class="mt-2 space-y-1 ml-4">
                                                <li>• Extra payments go directly to principal reduction</li>
                                                <li>• Interest is recalculated on the reduced balance</li>
                                                <li>• This can significantly reduce total interest and loan duration</li>
                                                <li>• The calculator shows exact savings in time and money</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">🔗 Shareable Links</h4>
                                            <p>You can share your comparison scenarios with others. The share feature:</p>
                                            <ul class="mt-2 space-y-1 ml-4">
                                                <li>• Encodes all scenario data in the URL</li>
                                                <li>• No data is stored on any server</li>
                                                <li>• Links work instantly without any backend</li>
                                                <li>• Data is compressed to keep URLs manageable</li>
                                            </ul>
                                        </section>

                                        <section class="border-t pt-4 dark:border-gray-700">
                                            <h4 class="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">⚠️ Important Disclaimer</h4>
                                            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                                <p class="font-semibold mb-2">This calculator is for educational and informational purposes only.</p>
                                                <ul class="space-y-2 text-sm">
                                                    <li>• Results are estimates based on the inputs provided</li>
                                                    <li>• Actual payments may vary due to fees, insurance, or other factors</li>
                                                    <li>• Does not include property taxes, insurance, or other costs</li>
                                                    <li>• Not financial advice - consult with qualified professionals</li>
                                                    <li>• Verify all calculations with your lender before making decisions</li>
                                                </ul>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">🌍 Regional Differences</h4>
                                            <p>Mortgage calculations can vary by country:</p>
                                            <ul class="mt-2 space-y-1 ml-4 text-sm">
                                                <li>• <strong>Canada:</strong> Semi-annual compounding (default)</li>
                                                <li>• <strong>United States:</strong> Monthly compounding</li>
                                                <li>• <strong>UK/Australia:</strong> Daily/Monthly compounding</li>
                                                <li>• <strong>Fixed vs Variable:</strong> This calculator assumes fixed rates</li>
                                            </ul>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="button" id="close-info-modal" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:ml-3 sm:w-auto" aria-label="Close information modal">
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(t)}attachEventListeners(){const t=document.getElementById("close-info-modal"),e=document.getElementById("modal-backdrop");t&&t.addEventListener("click",()=>this.close()),e&&e.addEventListener("click",()=>this.close()),document.addEventListener("keydown",r=>{r.key==="Escape"&&this.isOpen&&this.close()});const a=document.getElementById(this.modalId);a&&a.addEventListener("keydown",r=>{if(r.key==="Tab"&&this.isOpen){const s=a.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),i=s[0],o=s[s.length-1];r.shiftKey&&document.activeElement===i?(r.preventDefault(),o==null||o.focus()):!r.shiftKey&&document.activeElement===o&&(r.preventDefault(),i==null||i.focus())}})}open(){const t=document.getElementById(this.modalId);if(t){t.classList.remove("hidden"),this.isOpen=!0,document.body.style.overflow="hidden";const e=document.getElementById("close-info-modal");e&&e.focus(),this.previousFocus=document.activeElement}}close(){const t=document.getElementById(this.modalId);t&&(t.classList.add("hidden"),this.isOpen=!1,document.body.style.overflow="",this.previousFocus&&typeof this.previousFocus.focus=="function"&&this.previousFocus.focus())}}const N={calculator:null,amortizationSchedule:null,infoModal:null};function yt(){const n=U.getPreferences(),t=n.theme||"system";(t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&document.documentElement.classList.add("dark");const e=document.getElementById("theme-toggle");e&&e.addEventListener("click",()=>{document.documentElement.classList.toggle("dark");const r=document.documentElement.classList.contains("dark")?"dark":"light";U.savePreferences({...n,theme:r}),p.emit(y.THEME_CHANGED,r)});const a=document.getElementById("info-button");a&&a.addEventListener("click",()=>{N.infoModal&&N.infoModal.open()})}function ht(){p.on(y.ERROR_OCCURRED,n=>{G(n.message||"An error occurred","error")}),p.on(y.NOTIFICATION,n=>{G(n.message,n.type||"info")}),p.on("schedule:show",n=>{var t;N.amortizationSchedule&&(N.amortizationSchedule.show(n),(t=document.getElementById("amortization-container"))==null||t.scrollIntoView({behavior:"smooth"}))})}let z=[];function G(n,t="info"){const e=document.createElement("div"),a=Date.now(),r={success:"bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300",error:"bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 border border-red-200 dark:border-red-800",info:"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"};e.className=`fixed right-4 z-50 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-fade-in ${r[t]||r.info}`,e.dataset.notificationId=a,e.setAttribute("role","alert"),e.setAttribute("aria-live",t==="error"?"assertive":"polite"),e.setAttribute("aria-atomic","true");const i=16+z.length*76;e.style.top=`${i}px`,e.style.transition="all 0.3s ease-out";const o={success:"✓",error:"✕",info:"ℹ"};e.innerHTML=`
        <div class="flex items-center gap-3">
            <span class="text-lg" aria-hidden="true">${o[t]||o.info}</span>
            <span class="text-sm font-medium">${n}</span>
        </div>
    `,document.body.appendChild(e),z.push(a),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.remove(),z=z.filter(m=>m!==a),gt()},300)},2700)}function gt(){document.querySelectorAll("[data-notification-id]").forEach((t,e)=>{const a=16+e*76;t.style.top=`${a}px`})}function xt(){const n=document.querySelector("main");if(n&&!document.getElementById("amortization-container")){const t=document.createElement("div");t.id="amortization-container",n.appendChild(t)}}function W(){E.info("Initializing Canadian Mortgage Calculator"),yt(),xt();const n=U.getPreferences();E.debug("Loaded preferences",n),N.calculator=new mt("calculator-container"),E.info("Modern calculator component initialized"),N.amortizationSchedule=new ut("amortization-container"),E.info("Amortization schedule initialized"),N.infoModal=new pt,E.info("Info modal initialized"),ht(),ft(),E.info("Application initialized successfully")}async function ft(){try{const t="/mortgage-calculator/version.json".replace(/\/\//g,"/"),e=await fetch(t);if(e.ok){const a=await e.json();j(a)}else throw new Error("Version file not found")}catch(n){E.debug("Could not load version info",n),j({version:"dev",buildTimeLocal:new Date().toLocaleString()})}}function j(n){const t=document.querySelector("footer");if(!t)return;let e=t.querySelector(".version-info");e||(e=document.createElement("p"),e.className="version-info text-center text-xs text-gray-400 dark:text-gray-500 mt-2",t.querySelector(".max-w-7xl").appendChild(e));const a=[];n.version&&n.version!=="unknown"&&(n.isRelease?a.push(`Release: ${n.version}`):a.push(`Version: ${n.version}`)),n.buildTimeLocal&&a.push(`Deployed: ${n.buildTimeLocal}`),a.length>0&&(e.textContent=a.join(" • "))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",W):W();
//# sourceMappingURL=index-IGB1er3u.js.map
