import{D as U}from"./decimal-CNRKZ6of.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const u={MAX_AMORTIZATION_HIGH_RATIO:300,MAX_AMORTIZATION_CONVENTIONAL:360,MIN_AMORTIZATION:12,MIN_INTEREST_RATE:.01,MAX_INTEREST_RATE:30,MIN_PRINCIPAL:1e3,MAX_PRINCIPAL:1e7,MIN_DOWN_PAYMENT_UNDER_500K:.05,MIN_DOWN_PAYMENT_500K_TO_1M:.1,MIN_DOWN_PAYMENT_OVER_1M:.2,PAYMENT_FREQUENCIES:{MONTHLY:"monthly",BI_WEEKLY:"bi-weekly",WEEKLY:"weekly"},PAYMENTS_PER_YEAR:{monthly:12,"bi-weekly":26,weekly:52},COMPOUNDING_PERIODS_PER_YEAR:2,PREPAYMENT_FREQUENCIES:{PER_PAYMENT:"per-payment",ANNUAL:"annual",ONE_TIME:"one-time"},MAX_COMPARISON_SCENARIOS:5,DEFAULT_PAYMENT_FREQUENCY:"monthly",STORAGE_KEYS:{SCENARIOS:"mortgage-calc-scenarios",COMPARISONS:"mortgage-calc-comparisons",PREFERENCES:"mortgage-calc-preferences",CURRENT:"mortgage-calc-current"},ERROR_CODES:{INVALID_PRINCIPAL:"INVALID_PRINCIPAL",INVALID_RATE:"INVALID_RATE",INVALID_TERM:"INVALID_TERM",CALCULATION_ERROR:"CALCULATION_ERROR",COMPARISON_FULL:"COMPARISON_FULL",STORAGE_ERROR:"STORAGE_ERROR"}};class j{constructor(){this.keys=u.STORAGE_KEYS}isAvailable(){try{const t="__storage_test__";return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch{return!1}}get(t){if(!this.isAvailable())return null;try{const e=localStorage.getItem(t);return e?JSON.parse(e):null}catch(e){return console.error(`Error reading from localStorage: ${t}`,e),null}}set(t,e){if(!this.isAvailable())return!1;try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch(a){return console.error(`Error writing to localStorage: ${t}`,a),!1}}remove(t){if(!this.isAvailable())return!1;try{return localStorage.removeItem(t),!0}catch(e){return console.error(`Error removing from localStorage: ${t}`,e),!1}}clear(){this.isAvailable()&&Object.values(this.keys).forEach(t=>{this.remove(t)})}saveScenarios(t){return this.set(this.keys.SCENARIOS,t)}getScenarios(){return this.get(this.keys.SCENARIOS)||[]}saveComparisons(t){return this.set(this.keys.COMPARISONS,t)}getComparisons(){return this.get(this.keys.COMPARISONS)||[]}savePreferences(t){return this.set(this.keys.PREFERENCES,t)}getPreferences(){return this.get(this.keys.PREFERENCES)||{theme:"system",locale:"en-CA",defaultPaymentFrequency:"monthly",showAdvancedOptions:!1}}saveCurrent(t){return this.set(this.keys.CURRENT,t)}getCurrent(){return this.get(this.keys.CURRENT)}}const Y=new j;class G{constructor(){this.events={}}on(t,e){return this.events[t]||(this.events[t]=[]),this.events[t].push(e),()=>{this.events[t]=this.events[t].filter(a=>a!==e)}}once(t,e){const a=(...n)=>{e(...n),this.off(t,a)};this.on(t,a)}off(t,e){this.events[t]&&(this.events[t]=this.events[t].filter(a=>a!==e))}emit(t,e){this.events[t]&&this.events[t].forEach(a=>{try{a(e)}catch(n){console.error(`Error in event handler for ${t}:`,n)}})}clear(){this.events={}}listenerCount(t){return this.events[t]?this.events[t].length:0}}const h={CALCULATION_COMPLETE:"calculation:complete",THEME_CHANGED:"theme:changed",ERROR_OCCURRED:"error:occurred",NOTIFICATION:"notification:show"},m=new G,I={DEBUG:0,INFO:1,WARN:2,ERROR:3};class X{constructor(){this.level=I.WARN,this.logs=[],this.maxLogs=100}setLevel(t){this.level=I[t]||I.INFO}debug(t,e){this.level<=I.DEBUG&&(console.debug(`[DEBUG] ${t}`,e||""),this.addLog("DEBUG",t,e))}info(t,e){this.level<=I.INFO&&(console.log(`[INFO] ${t}`,e||""),this.addLog("INFO",t,e))}warn(t,e){this.level<=I.WARN&&(console.warn(`[WARN] ${t}`,e||""),this.addLog("WARN",t,e))}error(t,e){this.level<=I.ERROR&&(console.error(`[ERROR] ${t}`,e||""),this.addLog("ERROR",t,e))}addLog(t,e,a){this.logs.push({level:t,message:e,data:a,timestamp:new Date().toISOString()}),this.logs.length>this.maxLogs&&this.logs.shift()}getLogs(){return[...this.logs]}clearLogs(){this.logs=[]}exportLogs(){return JSON.stringify(this.logs,null,2)}}const A=new X;U.set({precision:20,rounding:U.ROUND_HALF_UP,toExpNeg:-7,toExpPos:21,minE:-9e15,maxE:9e15});function c(s){return new U(s)}function k(s,t){return c(s).plus(c(t))}function y(s,t){return c(s).minus(c(t))}function O(s,t){return c(s).times(c(t))}function x(s,t){return c(s).dividedBy(c(t))}function M(s,t){return c(s).pow(c(t))}function f(s,t=2){return c(s).toDecimalPlaces(t).toNumber()}class K extends Error{constructor(t,e){super(t),this.name="MortgageCalculatorError",this.code=e}}class Z extends K{constructor(t){super(t,u.ERROR_CODES.CALCULATION_ERROR),this.name="CalculationError"}}function z(s){try{const{principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:n}=s,r=x(e,100),i=x(r,2),o=u.PAYMENTS_PER_YEAR[n],d=k(1,i),p=y(M(d,2),1),L=k(1,p),w=y(M(L,x(1,o)),1),E=O(a,x(o,12)),N=k(1,w),S=M(N,E),v=O(w,S),$=y(S,1),b=O(t,x(v,$)),g=O(b,E),C=y(g,t),R=new Date,P=new Date(R);return P.setMonth(P.getMonth()+parseInt(a)),{regularPayment:f(b,2),totalPayments:f(E,0),totalInterest:f(C,2),totalCost:f(g,2),payoffDate:P.toISOString().split("T")[0],effectiveRate:f(w,6)}}catch(t){throw new Z(`Failed to calculate mortgage: ${t.message}`)}}function Q(s){const{principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:n}=s,r=z(s),i=c(r.regularPayment),o=[];let d=c(t);const p=x(e,100),L=x(p,2),w=k(1,L),E=y(M(w,2),1),N=u.PAYMENTS_PER_YEAR[n],S=k(1,E),v=y(M(S,x(1,N)),1),$=Math.ceil(r.totalPayments),b=new Date;for(let g=1;g<=$;g++){const C=O(d,v),R=y(i,C);d=y(d,R),d.lessThan(0)&&(d=c(0));const P=new Date(b),B=Math.floor(g*12/N);if(P.setMonth(P.getMonth()+B),o.push({paymentNumber:g,paymentDate:P.toISOString().split("T")[0],principalPayment:f(R,2),interestPayment:f(C,2),totalPayment:f(i,2),remainingBalance:f(d,2)}),d.equals(0))break}return o}function H(s){const{principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:n,extraPayment:r,extraPaymentFrequency:i}=s,o=z({principal:t,interestRate:e,amortizationMonths:a,paymentFrequency:n}),d=x(e,100),p=x(d,2),L=k(1,p),w=y(M(L,2),1),E=u.PAYMENTS_PER_YEAR[n],N=k(1,w),S=y(M(N,x(1,E)),1);let v=c(t);const $=c(o.regularPayment);let b=0,g=c(0);const C=1e4;for(;v.greaterThan(0)&&b<C;){b++;const D=O(v,S);g=k(g,D);let F=y($,D),_=c(0);(i==="per-payment"||i==="annual"&&b%E===0||i==="one-time"&&b===1)&&(_=c(r)),F=k(F,_),F.greaterThan(v)&&(F=v),v=y(v,F)}const R=Math.ceil(b/E*12),P=y(o.totalInterest,g),B=a-R;return{actualPayoffMonths:R,totalInterestSaved:f(P,2),monthsSaved:B,totalCostWithPrepayment:f(k(t,g),2),originalTotalCost:o.totalCost,savingsPercentage:f(x(P,o.totalInterest).times(100),2)}}function J(s){const t=[],e=[],{principal:a,interestRate:n,amortizationMonths:r,paymentFrequency:i,isHighRatio:o}=s;return a<u.MIN_PRINCIPAL&&t.push("PRINCIPAL_TOO_LOW"),a>u.MAX_PRINCIPAL&&t.push("PRINCIPAL_TOO_HIGH"),n<u.MIN_INTEREST_RATE&&t.push("RATE_TOO_LOW"),n>u.MAX_INTEREST_RATE&&t.push("RATE_TOO_HIGH"),r<u.MIN_AMORTIZATION&&t.push("TERM_TOO_SHORT"),o&&r>u.MAX_AMORTIZATION_HIGH_RATIO?t.push("TERM_TOO_LONG_HIGH_RATIO"):r>u.MAX_AMORTIZATION_CONVENTIONAL&&t.push("TERM_TOO_LONG_CONVENTIONAL"),u.PAYMENTS_PER_YEAR[i]||t.push("INVALID_PAYMENT_FREQUENCY"),{isValid:t.length===0,errors:t,warnings:e}}const tt=new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",minimumFractionDigits:2,maximumFractionDigits:2});function l(s){return s==null||isNaN(s)?"$0.00":tt.format(s)}function et(s){if(s=s.replace(/\s/g,""),!/^[0-9+\-*/().,]+$/.test(s))return null;s=s.replace(/,/g,"");try{const t=Function('"use strict"; return ('+s+")")();return typeof t=="number"&&!isNaN(t)&&isFinite(t)?Math.round(t*100)/100:null}catch{return null}}function at(s){return/[+\-*/()]/.test(s)}function st(s){if(!s||s.length===0)return"";try{const t=s.map(a=>{const n=[a.principal,Math.round(a.interestRate*100),a.amortizationMonths,a.paymentFrequency.charAt(0),a.extraPaymentAmount||0];return a.extraPaymentFrequency!=="per-payment"&&n.push(a.extraPaymentFrequency==="annual"?"a":"o"),n.join("|")}).join(";");return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}catch(t){return console.error("Error encoding scenarios:",t),""}}function nt(s){if(!s)return[];try{const t=s.replace(/-/g,"+").replace(/_/g,"/")+"==".substring(0,(4-s.length%4)%4);return atob(t).split(";").map(n=>{const r=n.split("|");return{principal:parseFloat(r[0]),interestRate:parseFloat(r[1])/100,amortizationMonths:parseInt(r[2]),paymentFrequency:r[3]==="w"?"weekly":r[3]==="b"?"bi-weekly":"monthly",extraPaymentAmount:parseFloat(r[4])||0,extraPaymentFrequency:r[5]==="a"?"annual":r[5]==="o"?"one-time":"per-payment"}})}catch(t){return console.error("Error decoding scenarios:",t),[]}}function rt(s){const t=st(s);return t?`${window.location.href.split("?")[0]}?s=${t}`:window.location.href.split("?")[0]}function it(){const t=new URLSearchParams(window.location.search).get("s");return nt(t)}function ot(){const s=new URL(window.location);s.searchParams.delete("s"),window.history.replaceState({},document.title,s.pathname)}async function lt(s){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(s),!0;{const t=document.createElement("textarea");t.value=s,t.style.position="fixed",t.style.left="-999999px",document.body.appendChild(t),t.select();const e=document.execCommand("copy");return document.body.removeChild(t),e}}catch(t){return console.error("Failed to copy to clipboard:",t),!1}}class ct{constructor(t){if(this.container=document.getElementById(t),!this.container){console.error(`Container with id '${t}' not found`);return}this.state={principal:298e3,interestRate:4.05,amortizationMonths:360,paymentFrequency:"weekly",targetPayment:null,extraPaymentAmount:0,extraPaymentFrequency:"per-payment"},this.result=null,this.prepaymentResult=null,this.scenarios=[],this.loadSharedScenarios(),this.render(),this.attachEventListeners(),this.calculateAll()}render(){var t;this.container.innerHTML=`
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
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Loan Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="principal"
                      value="${this.state.principal}"
                      min="1000"
                      max="${u.MAX_PRINCIPAL}"
                      step="1000"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <!-- Interest Rate & Amortization -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Interest Rate
                    </label>
                    <div class="relative">
                      <input
                        type="number"
                        id="interestRate"
                        value="${this.state.interestRate}"
                        min="0.01"
                        max="30"
                        step="0.01"
                        class="w-full pr-8 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Amortization
                    </label>
                    <input
                      type="number"
                      id="amortizationYears"
                      value="${this.state.amortizationMonths/12}"
                      min="1"
                      max="30"
                      step="1"
                      placeholder="Years"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <!-- Payment Frequency -->
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Payment Frequency
                  </label>
                  <select 
                    id="paymentFrequency" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="weekly" ${this.state.paymentFrequency==="weekly"?"selected":""}>Weekly (52/year)</option>
                    <option value="bi-weekly" ${this.state.paymentFrequency==="bi-weekly"?"selected":""}>Bi-weekly (26/year)</option>
                    <option value="monthly" ${this.state.paymentFrequency==="monthly"?"selected":""}>Monthly (12/year)</option>
                  </select>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Prepayment Options</h3>

                <!-- Extra Payment -->
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Extra Payment Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="extraPayment"
                      value="${this.state.extraPaymentAmount||""}"
                      placeholder="e.g., 100 or (1200/12)+50"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Enter amount or expression (e.g., 1200/12 or 50+25). Press Enter to calculate.</p>
                  ${this.state.extraPaymentAmount<0?'<p class="text-xs text-red-600 dark:text-red-400 mt-1">Amount must be positive</p>':this.state.extraPaymentAmount>((t=this.result)==null?void 0:t.regularPayment)*2?'<p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Warning: Extra payment is very high</p>':""}
                </div>

                <!-- Extra Payment Type -->
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Extra Payment Type
                  </label>
                  <select 
                    id="extraPaymentFrequency" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="per-payment">Each Payment</option>
                    <option value="annual">Annual Lump Sum</option>
                    <option value="one-time">One-time Payment</option>
                  </select>
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
                <div id="base-mortgage-results">
                  ${this.renderMainResults()}
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
                      <button id="share-scenarios" class="btn btn-secondary btn-sm text-xs sm:text-sm" title="Share scenarios">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Share
                      </button>
                    `:""}
                    <button id="add-to-comparison" class="btn btn-primary btn-sm text-xs sm:text-sm">
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
                <button id="view-schedule" class="btn btn-secondary flex-1 text-sm sm:text-base">
                  View Amortization Schedule
                </button>
                <button id="reset" class="btn btn-secondary text-sm sm:text-base">
                  Reset Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}renderMainResults(){return this.result?(this.state.paymentFrequency==="monthly"?this.result.regularPayment:this.result.regularPayment*u.PAYMENTS_PER_YEAR[this.state.paymentFrequency]/12,`
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">${this.state.paymentFrequency} Payment</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${l(this.result.regularPayment)}
          </div>
          <div class="text-xs text-gray-500">${u.PAYMENTS_PER_YEAR[this.state.paymentFrequency]} payments/year</div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Interest</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${l(this.result.totalInterest)}
          </div>
          <div class="text-xs text-gray-500">${(this.result.totalInterest/this.state.principal*100).toFixed(1)}% of principal</div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${l(this.result.totalCost)}
          </div>
          <div class="text-xs text-gray-500">${this.state.amortizationMonths/12} year term</div>
        </div>
      </div>
    `):`
        <div class="text-center py-8 text-gray-500">
          <p>Enter your mortgage details to see payment information</p>
        </div>
      `}renderTargetPaymentAnalysis(){const t=parseFloat(this.state.targetPayment);if(!t||!this.result)return"";const e=t-this.result.regularPayment,a=(e/this.result.regularPayment*100).toFixed(1);if(Math.abs(e)<1)return`
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200">
            ✓ Your target payment matches the calculated payment!
          </p>
        </div>
      `;const n=e>=0;return`
      <div class="mt-4 p-3 ${n?"bg-green-50 dark:bg-green-900/20":"bg-red-50 dark:bg-red-900/20"} rounded-lg">
        <p class="text-sm ${n?"text-green-800 dark:text-green-200":"text-red-800 dark:text-red-200"}">
          ${n?`✓ You can afford this mortgage! Your target is ${l(Math.abs(e))} (${Math.abs(a)}%) higher.`:`✗ Target payment is ${l(Math.abs(e))} (${Math.abs(a)}%) below required.`}
        </p>
        ${n&&e>10?`
          <p class="text-xs mt-1 ${n?"text-green-700 dark:text-green-300":"text-red-700 dark:text-red-300"}">
            Consider adding ${l(e)} as extra payment to pay off faster!
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
        `;const t=this.prepaymentResult,e=Math.floor(t.monthsSaved/12),a=t.monthsSaved%12,n=this.state.extraPaymentFrequency==="per-payment"?this.result.regularPayment+this.state.extraPaymentAmount:this.result.regularPayment,r=Math.floor(t.actualPayoffMonths/12),i=t.actualPayoffMonths%12,o=Math.floor(this.state.amortizationMonths/12),d=this.state.amortizationMonths%12;return`
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">New Payment</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${l(n)}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              ${this.state.paymentFrequency==="weekly"?"Weekly":this.state.paymentFrequency==="bi-weekly"?"Bi-weekly":"Monthly"}
            </div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Interest Saved</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${l(t.totalInterestSaved)}
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
              ${r}y ${i}m
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              vs ${o}y ${d}m
            </div>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-green-200/50 dark:bg-green-900/50 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200 text-center">
            💡 Adding ${l(this.state.extraPaymentAmount)} ${this.state.extraPaymentFrequency==="per-payment"?"to each payment":this.state.extraPaymentFrequency==="annual"?"annually":"once"} 
            saves ${l(t.totalInterestSaved)} and ${e} years ${a} months!
          </p>
        </div>
    `}renderComparisonTable(){return this.scenarios.length===0?`
                <div class="text-center py-8 text-gray-500">
                    <p class="mb-2">No scenarios added yet.</p>
                    <p class="text-sm">Click "+ Add Current" to compare different prepayment strategies.</p>
                </div>
            `:`
            <div class="overflow-x-auto max-h-96 overflow-y-auto">
                <table class="w-full text-sm min-w-[600px]">
                    <thead class="sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <th class="text-left py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Scenario</th>
                            <th class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Payment</th>
                            <th class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Interest</th>
                            <th class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Total Cost</th>
                            <th class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Time</th>
                            <th class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Savings</th>
                            <th class="text-center py-2 px-2 sm:px-3"></th>
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
                                        ${l(t.principal)} @ ${t.interestRate}%
                                        ${t.extraPaymentAmount>0?` • +${l(t.extraPaymentAmount)}`:""}
                                    </div>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap">
                                    <div class="text-xs sm:text-sm">${l(t.totalPayment)}</div>
                                    <div class="text-xs text-gray-500">
                                        ${t.paymentFrequency==="weekly"?"W":t.paymentFrequency==="bi-weekly"?"B":"M"}
                                    </div>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap hidden sm:table-cell">
                                    <span class="text-xs sm:text-sm">${l(t.totalInterest)}</span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <span class="text-xs sm:text-sm">${l(t.totalCost)}</span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap">
                                    <span class="text-xs sm:text-sm">
                                        ${Math.floor(t.payoffMonths/12)}y ${t.payoffMonths%12}m
                                    </span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3">
                                    ${(()=>{if(t.savings>0){const a=this.scenarios[0],r=(a?a.payoffMonths:t.amortizationMonths)-t.payoffMonths,i=Math.floor(r/12),o=r%12;return`
                                                <div>
                                                    <div class="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm">
                                                        ${l(t.savings)}
                                                    </div>
                                                    ${r>0?`
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">
                                                            ${i}y ${o}m saved
                                                        </div>
                                                    `:""}
                                                </div>
                                            `}return'<span class="text-gray-500 text-xs sm:text-sm">-</span>'})()}
                                </td>
                                <td class="text-center py-2 px-2 sm:px-3">
                                    <button class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg" 
                                            onclick="window.removeScenario(${e})">
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `}attachEventListeners(){["principal","interestRate","amortizationYears","paymentFrequency","extraPayment","extraPaymentFrequency"].forEach(r=>{const i=document.getElementById(r);i&&(i.addEventListener("input",o=>{this.handleInputChange(o),this.calculateAll()}),i.tagName==="SELECT"&&i.addEventListener("change",o=>{this.handleInputChange(o),this.calculateAll()}),r==="extraPayment"&&(i.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),this.evaluateExtraPayment())}),i.addEventListener("blur",()=>{this.evaluateExtraPayment()})))});const e=document.getElementById("reset");e&&e.addEventListener("click",()=>this.handleReset());const a=document.getElementById("add-to-comparison");a&&a.addEventListener("click",()=>this.addToComparison()),window.removeScenario=r=>{this.scenarios.splice(r,1),this.updateComparisonSection(),this.attachShareButtonListener()},this.attachShareButtonListener();const n=document.getElementById("view-schedule");n&&n.addEventListener("click",()=>{this.result&&m.emit("schedule:show",this.state)})}handleInputChange(t){const{id:e,value:a}=t.target;switch(e){case"principal":this.state.principal=parseFloat(a)||0;break;case"interestRate":this.state.interestRate=parseFloat(a)||0;break;case"amortizationYears":this.state.amortizationMonths=(parseInt(a)||0)*12;break;case"paymentFrequency":this.state.paymentFrequency=a;break;case"targetPayment":this.state.targetPayment=a?parseFloat(a):null;break;case"extraPayment":break;case"extraPaymentFrequency":this.state.extraPaymentFrequency=a;break}}calculateAll(){clearTimeout(this.calculationTimeout),this.calculationTimeout=setTimeout(()=>{this.performCalculations()},300)}performCalculations(){if(!J(this.state).isValid){this.result=null,this.prepaymentResult=null,this.updateResults();return}try{this.result=z(this.state),this.state.extraPaymentAmount>0?this.prepaymentResult=H({...this.state,extraPayment:this.state.extraPaymentAmount,extraPaymentFrequency:this.state.extraPaymentFrequency}):this.prepaymentResult=null,this.updateResults(),m.emit(h.CALCULATION_COMPLETE,{inputs:this.state,result:this.result,prepaymentResult:this.prepaymentResult})}catch(e){A.error("Calculation failed",e),this.result=null,this.prepaymentResult=null,this.updateResults()}}updateResults(){const t=document.querySelector("#base-mortgage-results");t&&(t.innerHTML=this.renderMainResults());const e=document.querySelector("#prepayment-section");e&&(this.prepaymentResult&&this.state.extraPaymentAmount>0?e.innerHTML=`
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
                      <button id="share-scenarios" class="btn btn-secondary btn-sm text-xs sm:text-sm" title="Share scenarios">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Share
                      </button>
                    `:""}
                    <button id="add-to-comparison" class="btn btn-primary btn-sm text-xs sm:text-sm">
                      + Add Current
                    </button>
                  </div>
                </div>
                <div id="inline-comparison-table" class="overflow-x-auto -mx-4 sm:mx-0">
                  <div class="px-4 sm:px-0 min-w-full">
                    ${this.renderComparisonTable()}
                  </div>
                </div>
            `;const a=document.getElementById("add-to-comparison");a&&a.addEventListener("click",()=>this.addToComparison())}}handleReset(){this.state={principal:298e3,interestRate:4.05,amortizationMonths:360,paymentFrequency:"weekly",targetPayment:null,extraPaymentAmount:0,extraPaymentFrequency:"per-payment"},this.result=null,this.prepaymentResult=null,this.render(),this.attachEventListeners(),this.calculateAll()}evaluateExtraPayment(){const t=document.getElementById("extraPayment");if(!t)return;const e=t.value.trim();if(!e){this.state.extraPaymentAmount=0,this.calculateAll();return}if(at(e)){const a=et(e);a!==null?a<0?(m.emit(h.NOTIFICATION,{message:`${e} = ${a} (must be positive)`,type:"error"}),this.state.extraPaymentAmount=0,t.value=0):(this.state.extraPaymentAmount=a,t.value=a,this.calculateAll(),m.emit(h.NOTIFICATION,{message:`Calculated: ${e} = ${a}`,type:"info"})):m.emit(h.NOTIFICATION,{message:"Invalid expression. Use numbers and +, -, *, /, ()",type:"error"})}else{const a=parseFloat(e);!isNaN(a)&&a>=0?(this.state.extraPaymentAmount=a,this.calculateAll()):a<0&&(this.state.extraPaymentAmount=0,t.value=0,m.emit(h.NOTIFICATION,{message:"Extra payment must be positive",type:"error"}))}}addToComparison(){if(!this.result)return;const t=this.scenarios.find(i=>i.extraPaymentAmount===0);t?t.totalCost:this.result.totalCost;let e=this.result.regularPayment;this.state.extraPaymentAmount>0&&this.state.extraPaymentFrequency==="per-payment"&&(e+=this.state.extraPaymentAmount);let a="";if(this.scenarios.length===0)a="Base Scenario";else{const i=this.scenarios[0],o=[];this.state.principal!==i.principal&&o.push(`${l(this.state.principal)}`),this.state.interestRate!==i.interestRate&&o.push(`${this.state.interestRate}%`),this.state.amortizationMonths!==i.amortizationMonths&&o.push(`${this.state.amortizationMonths/12}yr`),this.state.paymentFrequency!==i.paymentFrequency&&o.push(this.state.paymentFrequency),this.state.extraPaymentAmount>0&&o.push(`+${l(this.state.extraPaymentAmount)}`),a=o.length>0?o.join(", "):"Scenario "+(this.scenarios.length+1)}const n={name:a,basePayment:this.result.regularPayment,totalPayment:e,extraPaymentAmount:this.state.extraPaymentAmount,extraPaymentFrequency:this.state.extraPaymentFrequency,totalInterest:this.prepaymentResult&&this.state.extraPaymentAmount>0?this.result.totalInterest-this.prepaymentResult.totalInterestSaved:this.result.totalInterest,totalCost:this.prepaymentResult&&this.state.extraPaymentAmount>0?this.prepaymentResult.totalCostWithPrepayment:this.result.totalCost,payoffMonths:this.prepaymentResult&&this.state.extraPaymentAmount>0&&this.prepaymentResult.actualPayoffMonths?this.prepaymentResult.actualPayoffMonths:this.state.amortizationMonths,savings:0,principal:this.state.principal,interestRate:this.state.interestRate,amortizationMonths:this.state.amortizationMonths,paymentFrequency:this.state.paymentFrequency};if(this.scenarios.some(i=>i.principal===n.principal&&i.interestRate===n.interestRate&&i.amortizationMonths===n.amortizationMonths&&i.paymentFrequency===n.paymentFrequency&&i.extraPaymentAmount===n.extraPaymentAmount&&i.extraPaymentFrequency===n.extraPaymentFrequency))m.emit(h.NOTIFICATION,{message:"This scenario already exists in comparison",type:"info"});else{if(this.scenarios.push(n),this.scenarios.length>1){const i=this.scenarios[0];this.scenarios.forEach(o=>{o.savings=i.totalCost-o.totalCost})}this.updateComparisonSection(),m.emit(h.NOTIFICATION,{message:"Added to comparison!",type:"success"}),this.attachShareButtonListener()}}loadSharedScenarios(){try{const t=it();if(t&&t.length>0){if(this.scenarios=[],t.forEach((e,a)=>{const n=z({principal:e.principal,interestRate:e.interestRate,amortizationMonths:e.amortizationMonths,paymentFrequency:e.paymentFrequency});let r=null;e.extraPaymentAmount>0&&(r=H({principal:e.principal,interestRate:e.interestRate,amortizationMonths:e.amortizationMonths,paymentFrequency:e.paymentFrequency,extraPayment:e.extraPaymentAmount,extraPaymentFrequency:e.extraPaymentFrequency}));let i=a===0?"Base Mortgage":"";if(a>0){const d=t[0],p=[];e.principal!==d.principal&&p.push(`${l(e.principal)} loan`),e.interestRate!==d.interestRate&&p.push(`${e.interestRate}% rate`),e.amortizationMonths!==d.amortizationMonths&&p.push(`${e.amortizationMonths/12}yr`),e.paymentFrequency!==d.paymentFrequency&&p.push(e.paymentFrequency),e.extraPaymentAmount>0&&p.push(`+${l(e.extraPaymentAmount)}`),i=p.slice(0,2).join(", ")}else e.extraPaymentAmount>0&&(i=`Base + ${l(e.extraPaymentAmount)}`);const o={name:i,principal:e.principal,interestRate:e.interestRate,amortizationMonths:e.amortizationMonths,paymentFrequency:e.paymentFrequency,extraPaymentAmount:e.extraPaymentAmount,extraPaymentFrequency:e.extraPaymentFrequency,regularPayment:n.regularPayment,totalPayment:n.regularPayment+(e.extraPaymentAmount||0),totalInterest:(r==null?void 0:r.totalInterest)||n.totalInterest,totalCost:(r==null?void 0:r.totalCost)||n.totalCost,payoffMonths:(r==null?void 0:r.actualPayoffMonths)||e.amortizationMonths,savings:0};this.scenarios.push(o)}),this.scenarios.length>0){const e=this.scenarios[0];this.scenarios.forEach(a=>{a.savings=e.totalCost-a.totalCost})}if(t[0]){const e=t[0];this.state.principal=e.principal,this.state.interestRate=e.interestRate,this.state.amortizationMonths=e.amortizationMonths,this.state.paymentFrequency=e.paymentFrequency,this.state.extraPaymentAmount=e.extraPaymentAmount||0,this.state.extraPaymentFrequency=e.extraPaymentFrequency||"per-payment"}ot(),m.emit(h.NOTIFICATION,{message:`Loaded ${t.length} shared scenario${t.length>1?"s":""}!`,type:"success"})}}catch(t){A.error("Failed to load shared scenarios:",t)}}attachShareButtonListener(){const t=document.getElementById("share-scenarios");t&&t.addEventListener("click",()=>this.shareScenarios())}async shareScenarios(){if(this.scenarios.length===0){m.emit(h.NOTIFICATION,{message:"No scenarios to share",type:"info"});return}try{const t=rt(this.scenarios);await lt(t)?m.emit(h.NOTIFICATION,{message:"Share link copied to clipboard!",type:"success"}):prompt("Copy this link to share:",t)}catch(t){A.error("Failed to generate share link:",t),m.emit(h.NOTIFICATION,{message:"Failed to generate share link",type:"error"})}}}class dt{constructor(t){this.container=document.getElementById(t),this.schedule=[],this.pageSize=50,this.currentPage=0}show(t){this.schedule=Q(t),this.currentPage=0,this.render()}render(){if(this.schedule.length===0){this.container.innerHTML="";return}const t=this.currentPage*this.pageSize,e=Math.min(t+this.pageSize,this.schedule.length),a=this.schedule.slice(t,e);this.container.innerHTML=`
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
              ${a.map(n=>`
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${n.paymentNumber}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    ${n.paymentDate}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ${l(n.principalPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ${l(n.interestPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    ${l(n.totalPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right ${n.remainingBalance===0?"text-green-600 dark:text-green-400 font-bold":"text-gray-900 dark:text-white"}">
                    ${l(n.remainingBalance)}
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
    `,this.attachEventListeners()}attachEventListeners(){const t=document.getElementById("close-schedule");t&&t.addEventListener("click",()=>{this.container.innerHTML=""});const e=document.getElementById("prev-page");e&&e.addEventListener("click",()=>{this.currentPage>0&&(this.currentPage--,this.render())});const a=document.getElementById("next-page");a&&a.addEventListener("click",()=>{const r=Math.ceil(this.schedule.length/this.pageSize)-1;this.currentPage<r&&(this.currentPage++,this.render())});const n=document.getElementById("download-schedule");n&&n.addEventListener("click",()=>{this.downloadCSV()})}downloadCSV(){const t=["Payment #","Date","Principal","Interest","Total Payment","Remaining Balance"],e=this.schedule.map(o=>[o.paymentNumber,o.paymentDate,o.principalPayment,o.interestPayment,o.totalPayment,o.remainingBalance]),a=[t.join(","),...e.map(o=>o.join(","))].join(`
`),n=new Blob([a],{type:"text/csv"}),r=URL.createObjectURL(n),i=document.createElement("a");i.href=r,i.download=`amortization-schedule-${new Date().toISOString().split("T")[0]}.csv`,i.click(),URL.revokeObjectURL(r)}}class mt{constructor(){this.modalId="info-modal",this.isOpen=!1,this.render(),this.attachEventListeners()}render(){const t=document.createElement("div");t.id=this.modalId,t.className="fixed inset-0 z-50 hidden",t.innerHTML=`
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" id="modal-backdrop"></div>
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                    <h3 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                                        How This Calculator Works
                                    </h3>
                                    
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
                            <button type="button" id="close-info-modal" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:ml-3 sm:w-auto">
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(t)}attachEventListeners(){const t=document.getElementById("close-info-modal"),e=document.getElementById("modal-backdrop");t&&t.addEventListener("click",()=>this.close()),e&&e.addEventListener("click",()=>this.close()),document.addEventListener("keydown",a=>{a.key==="Escape"&&this.isOpen&&this.close()})}open(){const t=document.getElementById(this.modalId);t&&(t.classList.remove("hidden"),this.isOpen=!0,document.body.style.overflow="hidden")}close(){const t=document.getElementById(this.modalId);t&&(t.classList.add("hidden"),this.isOpen=!1,document.body.style.overflow="")}}const T={calculator:null,amortizationSchedule:null,infoModal:null};function ut(){const s=Y.getPreferences(),t=s.theme||"system";(t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&document.documentElement.classList.add("dark");const e=document.getElementById("theme-toggle");e&&e.addEventListener("click",()=>{document.documentElement.classList.toggle("dark");const n=document.documentElement.classList.contains("dark")?"dark":"light";Y.savePreferences({...s,theme:n}),m.emit(h.THEME_CHANGED,n)});const a=document.getElementById("info-button");a&&a.addEventListener("click",()=>{T.infoModal&&T.infoModal.open()})}function ht(){m.on(h.ERROR_OCCURRED,s=>{V(s.message||"An error occurred","error")}),m.on(h.NOTIFICATION,s=>{V(s.message,s.type||"info")}),m.on("schedule:show",s=>{var t;T.amortizationSchedule&&(T.amortizationSchedule.show(s),(t=document.getElementById("amortization-container"))==null||t.scrollIntoView({behavior:"smooth"}))})}let q=[];function V(s,t="info"){const e=document.createElement("div"),a=Date.now(),n={success:"bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300",error:"bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 border border-red-200 dark:border-red-800",info:"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"};e.className=`fixed right-4 z-50 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-fade-in ${n[t]||n.info}`,e.dataset.notificationId=a;const i=16+q.length*76;e.style.top=`${i}px`,e.style.transition="all 0.3s ease-out";const o={success:"✓",error:"✕",info:"ℹ"};e.innerHTML=`
        <div class="flex items-center gap-3">
            <span class="text-lg">${o[t]||o.info}</span>
            <span class="text-sm font-medium">${s}</span>
        </div>
    `,document.body.appendChild(e),q.push(a),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.remove(),q=q.filter(d=>d!==a),yt()},300)},2700)}function yt(){document.querySelectorAll("[data-notification-id]").forEach((t,e)=>{const a=16+e*76;t.style.top=`${a}px`})}function pt(){const s=document.querySelector("main");if(s&&!document.getElementById("amortization-container")){const t=document.createElement("div");t.id="amortization-container",s.appendChild(t)}}function W(){A.info("Initializing Canadian Mortgage Calculator"),ut(),pt();const s=Y.getPreferences();A.debug("Loaded preferences",s),T.calculator=new ct("calculator-container"),A.info("Modern calculator component initialized"),T.amortizationSchedule=new dt("amortization-container"),A.info("Amortization schedule initialized"),T.infoModal=new mt,A.info("Info modal initialized"),ht(),A.info("Application initialized successfully")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",W):W();
//# sourceMappingURL=index-flF8vhfF.js.map
