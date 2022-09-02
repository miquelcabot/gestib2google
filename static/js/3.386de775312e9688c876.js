webpackJsonp([3],{"2t6S":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("fZjL"),r=s.n(a),o=s("fgoS"),l=s("y6X4"),n=s("QmSG"),i={name:"Spreadsheet",data:function(){return{group:"",onlyteachers:!1,errors:[],loading:!1,groupsStudents:[],filename:""}},mounted:function(){this.groupsStudents=JSON.parse(sessionStorage.groupsStudents)},methods:{spreadsheet:function(){var e=this;this.loading=!0,Object(o.b)(null,function(t,s){if(t)e.errors.push('Error llegint usuaris "'+t.message+'"'),e.loading=!1;else{var a=[];r()(s).forEach(function(t){s[t].suspended||e.onlyteachers&&!s[t].teacher||e.group&&!s[t].groups.includes(e.group)||(s[t].teacher&&(a.Professorat||(a.Professorat=[]),a.Professorat.push([s[t].surname+", "+s[t].name,s[t].domainemail])),s[t].groups.forEach(function(e){e.includes(Object(n.a)().groupPrefixStudents)&&(a[e]||(a[e]=[]),a[e].push([s[t].surname+", "+s[t].name,s[t].domainemail]))}))});var o=[];r()(a).sort().forEach(function(e){o[e]=a[e]}),e.filename="Usuaris domini "+(new Date).toLocaleString(),Object(l.d)().spreadsheets.create({resource:{properties:{title:e.filename}},fields:"spreadsheetId"},function(t,s){if(t)e.errors.push('Error creant el full de càlcul "'+t.message+'"'),e.loading=!1;else{var a=s.data.spreadsheetId;e.addSheet(a,o,0,function(){e.loading=!1,e.$bvModal.show("modal-ok")})}})}})},addSheet:function(e,t,s,a){var o=this,n=r()(t);if(s>=n.length)a();else{var i=n[s];t[i].sort(function(e,t){return e.toString().localeCompare(t)}),t[i].unshift(["Nom","Email"]),Object(l.d)().spreadsheets.batchUpdate({spreadsheetId:e,resource:{requests:{addSheet:{properties:{title:i}}}}},function(r,n){r?(o.errors.push('Error afegint el grup "'+i+'" al full de càlcul "'+r.message+'"'),o.loading=!1):(0===s&&Object(l.d)().spreadsheets.batchUpdate({spreadsheetId:e,resource:{requests:{deleteSheet:{sheetId:0}}}},function(e){e&&(o.errors.push('Error esborrant les pàgines buides del full de càlcul "'+e.message+'"'),o.loading=!1)}),Object(l.d)().spreadsheets.values.update({spreadsheetId:e,range:i+"!A1",valueInputOption:"USER_ENTERED",resource:{values:t[i]}},function(r,l){r?(o.errors.push('Error afegint les dades del grup "'+i+'" al full de càlcul "'+r.message+'"'),o.loading=!1):o.addSheet(e,t,s+1,a)}))})}}}},c=s("XyMi");var u=function(e){s("Wa06")},d=Object(c.a)(i,function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"card shadow mb-4"},[e._m(0),e._v(" "),s("div",{staticClass:"card-body"},[e._m(1),e._v(" "),s("form",{on:{submit:function(e){e.preventDefault()}}},[s("div",{staticClass:"form-group"},[s("label",{staticClass:"col-sm col-form-label",attrs:{for:"groupsdomainuserscsv"}},[e._v("Grup d'alumnes")]),e._v(" "),s("div",{staticClass:"col-sm-10"},[s("select",{directives:[{name:"model",rawName:"v-model",value:e.group,expression:"group"}],staticClass:"form-control",attrs:{id:"group",name:"group",disabled:e.loading},on:{change:function(t){var s=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.group=t.target.multiple?s:s[0]}}},[s("option",{attrs:{value:""}},[e._v("Tots")]),e._v(" "),e._l(e.groupsStudents,function(t){return s("option",{key:t.email,domProps:{value:t.email}},[e._v("\n                "+e._s(t.nameWithEmail)+"\n              ")])})],2)])]),e._v(" "),s("div",{staticClass:"form-group"},[s("div",{staticClass:"form-check"},[s("label",{staticClass:"form-check-label"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.onlyteachers,expression:"onlyteachers"}],staticClass:"form-check-input",attrs:{id:"onlyteachers",name:"onlyteachers",type:"checkbox",disabled:e.loading},domProps:{checked:Array.isArray(e.onlyteachers)?e._i(e.onlyteachers,null)>-1:e.onlyteachers},on:{change:function(t){var s=e.onlyteachers,a=t.target,r=!!a.checked;if(Array.isArray(s)){var o=e._i(s,null);a.checked?o<0&&(e.onlyteachers=s.concat([null])):o>-1&&(e.onlyteachers=s.slice(0,o).concat(s.slice(o+1)))}else e.onlyteachers=r}}}),e._v(" Només professorat")])])]),e._v(" "),s("div",{staticClass:"form-group"},[s("button",{staticClass:"btn btn-primary",attrs:{disabled:e.loading},on:{click:function(t){return e.spreadsheet()}}},[e.loading?s("span",{staticClass:"spinner-border spinner-border-sm"}):e._e(),e._v("\n            "+e._s(e.loading?"Exportant ...":"Exportar")+"\n          ")])])])])]),e._v(" "),e._l(e.errors,function(t,a){return s("div",{key:a,staticClass:"alert alert-danger alert-dismissible fade show",attrs:{role:"alert"}},[s("strong",[e._v("ERROR: ")]),e._v(e._s(t)+"\n    "),e._m(2,!0)])}),e._v(" "),s("b-modal",{attrs:{id:"modal-ok",title:"GestIB2Google","ok-only":""}},[s("p",{staticClass:"my-4"},[e._v("Procés finalitzat!"),s("br"),e._v("Fitxer guardat a 'La meva unitat' de Google Drive amb el nom '"+e._s(e.filename)+"'.")])])],2)},[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"card-header py-3"},[t("h6",{staticClass:"m-0 font-weight-bold text-primary"},[this._v("Exportar a un full de càlcul")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"alert alert-warning",attrs:{role:"alert"}},[this._v("\n        ATENCIÓ: No es poden exportar més de 30 grups, degut a que hi ha un límit de 60 escriptures\n        als fulls de càlcul de Google per minut. Ho podeu consultar a\n        "),t("a",{attrs:{href:"https://developers.google.com/analytics/devguides/config/mgmt/v3/limits-quotas"}},[this._v('"Límites y cuotas en las solicitudes a API"')]),this._v(" i a\n        "),t("a",{attrs:{href:"https://developers.google.com/sheets/api/limits"}},[this._v('"Usage Limits"')])])},function(){var e=this.$createElement,t=this._self._c||e;return t("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"alert","aria-label":"Close"}},[t("span",{attrs:{"aria-hidden":"true"}},[this._v("×")])])}],!1,u,null,null);t.default=d.exports},Wa06:function(e,t){}});
//# sourceMappingURL=3.386de775312e9688c876.js.map