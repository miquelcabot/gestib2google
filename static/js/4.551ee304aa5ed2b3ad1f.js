webpackJsonp([4],{CAOZ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("QmSG"),r={name:"Setup",data:function(){return{domain:"",defaultPassword:"",groupPrefixDepartment:"",groupPrefixTeachers:"",groupPrefixStudents:"",groupPrefixTutors:"",organizationalUnitTeachers:"",organizationalUnitStudents:"",organizationalUnitStudentsWithGroups:!1,teachersEmailPrefix:"",teachersEmailFormat:"",teachersEmailCustomDomain:"",studentsEmailPrefix:"",studentsEmailFormat:"",studentsEmailCustomDomain:""}},mounted:function(){this.domain=Object(i.a)().domain,this.defaultPassword=Object(i.a)().defaultPassword,this.groupPrefixDepartment=Object(i.a)().groupPrefixDepartment,this.groupPrefixTeachers=Object(i.a)().groupPrefixTeachers,this.groupPrefixStudents=Object(i.a)().groupPrefixStudents,this.groupPrefixTutors=Object(i.a)().groupPrefixTutors,this.organizationalUnitTeachers=Object(i.a)().organizationalUnitTeachers,this.organizationalUnitStudents=Object(i.a)().organizationalUnitStudents,this.organizationalUnitStudentsWithGroups=Object(i.a)().organizationalUnitStudentsWithGroups,this.teachersEmailPrefix=Object(i.a)().teachersEmailPrefix,this.teachersEmailFormat=Object(i.a)().teachersEmailFormat,this.teachersEmailCustomDomain=Object(i.a)().teachersCustomDomain,this.studentsEmailPrefix=Object(i.a)().studentsEmailPrefix,this.studentsEmailFormat=Object(i.a)().studentsEmailFormat,this.studentsEmailCustomDomain=Object(i.a)().studentsCustomDomain},methods:{saveConfig:function(){}}},s=a("XyMi");var o=function(t){a("GyF+")},n=Object(s.a)(r,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card shadow mb-4"},[t._m(0),t._v(" "),a("div",{staticClass:"card-body"},[a("form",{on:{submit:function(t){t.preventDefault()}}},[a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"domain"}},[t._v("Domini")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.domain,expression:"domain"}],staticClass:"form-control",attrs:{id:"domain",name:"domain",type:"text",disabled:""},domProps:{value:t.domain},on:{input:function(e){e.target.composing||(t.domain=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"defaultPassword"}},[t._v("Password per defecte dels nous usuaris")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.defaultPassword,expression:"defaultPassword"}],staticClass:"form-control",attrs:{id:"defaultPassword",name:"defaultPassword",type:"text",disabled:""},domProps:{value:t.defaultPassword},on:{input:function(e){e.target.composing||(t.defaultPassword=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"groupPrefixDepartment"}},[t._v("Prefix dels grups de departaments")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.groupPrefixDepartment,expression:"groupPrefixDepartment"}],staticClass:"form-control",attrs:{id:"groupPrefixDepartment",name:"groupPrefixDepartment",type:"text",disabled:""},domProps:{value:t.groupPrefixDepartment},on:{input:function(e){e.target.composing||(t.groupPrefixDepartment=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"groupPrefixTeachers"}},[t._v("Prefix dels grups de professors (equips educatius)")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.groupPrefixTeachers,expression:"groupPrefixTeachers"}],staticClass:"form-control",attrs:{id:"groupPrefixTeachers",name:"groupPrefixTeachers",type:"text",disabled:""},domProps:{value:t.groupPrefixTeachers},on:{input:function(e){e.target.composing||(t.groupPrefixTeachers=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"groupPrefixStudents"}},[t._v("Prefix dels grups d'alumnes")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.groupPrefixStudents,expression:"groupPrefixStudents"}],staticClass:"form-control",attrs:{id:"groupPrefixStudents",name:"groupPrefixStudents",type:"text",disabled:""},domProps:{value:t.groupPrefixStudents},on:{input:function(e){e.target.composing||(t.groupPrefixStudents=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"groupPrefixTutors"}},[t._v("Prefix dels grups de tutors")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.groupPrefixTutors,expression:"groupPrefixTutors"}],staticClass:"form-control",attrs:{id:"groupPrefixTutors",name:"groupPrefixTutors",type:"text",disabled:""},domProps:{value:t.groupPrefixTutors},on:{input:function(e){e.target.composing||(t.groupPrefixTutors=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"organizationalUnitTeachers"}},[t._v("Nom de l'Unitat Organitzativa del professorat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.organizationalUnitTeachers,expression:"organizationalUnitTeachers"}],staticClass:"form-control",attrs:{id:"organizationalUnitTeachers",name:"organizationalUnitTeachers",type:"text",disabled:""},domProps:{value:t.organizationalUnitTeachers},on:{input:function(e){e.target.composing||(t.organizationalUnitTeachers=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"organizationalUnitStudents"}},[t._v("Nom de l'Unitat Organitzativa de l'alumnat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.organizationalUnitStudents,expression:"organizationalUnitStudents"}],staticClass:"form-control",attrs:{id:"organizationalUnitStudents",name:"organizationalUnitStudents",type:"text",disabled:""},domProps:{value:t.organizationalUnitStudents},on:{input:function(e){e.target.composing||(t.organizationalUnitStudents=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"organizationalUnitStudentsWithGroups"}},[t._v("Configuració de les unitats organitzatives de l'alumnat")]),t._v(" "),a("select",{directives:[{name:"model",rawName:"v-model",value:t.organizationalUnitStudentsWithGroups,expression:"organizationalUnitStudentsWithGroups"}],staticClass:"form-control",attrs:{id:"organizationalUnitStudentsWithGroups",name:"organizationalUnitStudentsWithGroups",disabled:""},on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.organizationalUnitStudentsWithGroups=e.target.multiple?a:a[0]}}},[a("option",{domProps:{value:!1}},[t._v("Sense grups d'alumnes")]),t._v(" "),a("option",{domProps:{value:!0}},[t._v("Amb grups d'alumnes")])])]),t._v(" "),a("hr",{staticClass:"separator"}),t._v(" "),t._m(1),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"teachersEmailPrefix"}},[t._v("Prefix de l'email del professorat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.teachersEmailPrefix,expression:"teachersEmailPrefix"}],staticClass:"form-control",attrs:{id:"teachersEmailPrefix",name:"teachersEmailPrefix",type:"text",disabled:""},domProps:{value:t.teachersEmailPrefix},on:{input:function(e){e.target.composing||(t.teachersEmailPrefix=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"teachersEmailFormat"}},[t._v("Format de l'email del professorat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.teachersEmailFormat,expression:"teachersEmailFormat"}],staticClass:"form-control",attrs:{id:"teachersEmailFormat",name:"teachersEmailFormat",type:"text",disabled:""},domProps:{value:t.teachersEmailFormat},on:{input:function(e){e.target.composing||(t.teachersEmailFormat=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"teachersEmailCustomDomain"}},[t._v("Domini personalitzat de l'email del professorat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.teachersEmailCustomDomain,expression:"teachersEmailCustomDomain"}],staticClass:"form-control",attrs:{id:"teachersEmailCustomDomain",name:"teachersEmailCustomDomain",type:"text",disabled:""},domProps:{value:t.teachersEmailCustomDomain},on:{input:function(e){e.target.composing||(t.teachersEmailCustomDomain=e.target.value)}}})]),t._v(" "),a("hr",{staticClass:"separator"}),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"studentsEmailPrefix"}},[t._v("Prefix de l'email de l'alumnat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.studentsEmailPrefix,expression:"studentsEmailPrefix"}],staticClass:"form-control",attrs:{id:"studentsEmailPrefix",name:"studentsEmailPrefix",type:"text",disabled:""},domProps:{value:t.studentsEmailPrefix},on:{input:function(e){e.target.composing||(t.studentsEmailPrefix=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"studentsEmailFormat"}},[t._v("Format de l'email de l'alumnat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.studentsEmailFormat,expression:"studentsEmailFormat"}],staticClass:"form-control",attrs:{id:"studentsEmailFormat",name:"studentsEmailFormat",type:"text",disabled:""},domProps:{value:t.studentsEmailFormat},on:{input:function(e){e.target.composing||(t.studentsEmailFormat=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{attrs:{for:"studentsEmailCustomDomain"}},[t._v("Domini personalitzat de l'email de l'alumnat")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.studentsEmailCustomDomain,expression:"studentsEmailCustomDomain"}],staticClass:"form-control",attrs:{id:"studentsEmailCustomDomain",name:"studentsEmailCustomDomain",type:"text",disabled:""},domProps:{value:t.studentsEmailCustomDomain},on:{input:function(e){e.target.composing||(t.studentsEmailCustomDomain=e.target.value)}}})])])])])},[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"card-header py-3"},[e("h6",{staticClass:"m-0 font-weight-bold text-primary"},[this._v("Configuració")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"alert alert-warning",attrs:{role:"alert"}},[t._v("\n        Per especificar el format dels emails d'alumnat i professorat es pot especificar:\n        "),a("ul",[a("li",[t._v("Prefix, abans del nom d'usuari")]),t._v(" "),a("li",[t._v("Format del nom d'usuari\n            "),a("ul",[a("li",[a("strong",[t._v("n")]),t._v(" inicial del nom, o "),a("strong",[t._v("N")]),t._v(" nom complet")]),t._v(" "),a("li",[a("strong",[t._v("p")]),t._v(" inicial del primer llinatge, o "),a("strong",[t._v("P")]),t._v(" primer llinatge complet")]),t._v(" "),a("li",[a("strong",[t._v("s")]),t._v(" inicial del segon llinatge, o "),a("strong",[t._v("S")]),t._v(" segon llinatge complet")]),t._v(" "),a("li",[a("strong",[t._v("0")]),t._v(" cada zero, serà un nombre (de 0 a n)")]),t._v(" "),a("li",[a("strong",[t._v(". _ -")]),t._v(" altres caràcters")])])]),t._v(" "),a("li",[t._v("Domini personalitzat")])])])}],!1,o,null,null);e.default=n.exports},"GyF+":function(t,e){}});
//# sourceMappingURL=4.551ee304aa5ed2b3ad1f.js.map