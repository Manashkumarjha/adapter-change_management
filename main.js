const path = require('path');
 
/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 * and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));
 
/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;
 
/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 * brokers and products can execute. This class inherits the EventEmitter
 * class.
 */
class ServiceNowAdapter extends EventEmitter {
 
/**
 * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
 * data-first convention.
 * @callbackServiceNowAdapter~requestCallback
 * @param{(object|string)}responseData - The entire REST API response.
 * @param{error}[errorMessage] - An error thrown by REST API call.
 */
 
/**
 * Here we document the adapter properties.
 * @typedef{object}ServiceNowAdapter~adapterProperties - Adapter
 * instance's properties object.
 * @property{string}url - ServiceNow instance URL.
 * @property{object}auth - ServiceNow instance credentials.
 * @property{string}auth.username - Login username.
 * @property{string}auth.password - Login password.
 * @property{string}serviceNowTable - The change request table name.
 */
 
/**
 * @memberofServiceNowAdapter
 * @constructs
 *
 * @description Instantiates a new instance of the Itential ServiceNow Adapter.
 * @param{string}id - Adapter instance's ID.
 * @param{ServiceNowAdapter~adapterProperties}adapterProperties - Adapter instance's properties object.
 */
constructor(id, adapterProperties) {
// Call super or parent class' constructor.
super();
// Copy arguments' values to object properties.
this.id=id;
this.props=adapterProperties;
// Instantiate an object from the connector.js module and assign it to an object property.
this.connector=new ServiceNowConnector({
url:this.props.url,
username:this.props.auth.username,
password:this.props.auth.password,
serviceNowTable:this.props.serviceNowTable
 });
 }
 
/**
 * @memberofServiceNowAdapter
 * @methodconnect
 * @summary Connect to ServiceNow
 * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
 * IAP calls this method after instantiating an object from the class.
 * There is no need for parameters because all connection details
 * were passed to the object's constructor and assigned to object property this.props.
 */
connect() {
// As a best practice, Itential recommends isolating the health check action
// in its own method.
this.healthcheck();
 }
 
/**
 * @memberofServiceNowAdapter
 * @methodhealthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 * Calls method emitOnline if external system is available.
 *
 * @param{ServiceNowAdapter~requestCallback}[callback] - The optional callback
 * that handles the response.
 */
/**
 * @memberofServiceNowAdapter
 * @methodhealthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 * Calls method emitOnline if external system is available.
 *
 * @param{ServiceNowAdapter~requestCallback}[callback] - The optional callback
 * that handles the response.
 */
healthcheck(callback) {
let callbackData=null;
let callbackerror=null;
this.getRecord((result, error) => {
/**
 * For this lab, complete the if else conditional
 * statements that check if an error exists
 * or the instance was hibernating. You must write
 * the blocks for each branch.
 */
if (error) {
this.emitOffline();
log.error('service Instance is offline'+this.id);
callbackError=error;
 }
else if(error==="ServiceNow Instance is hibernating"){
this.emitOffline();

 }
// else if(this.connector.isHibernating(result)){
// log.error('service Instance is Hibernating');
// this.emitOffline();
// }
// else if(this.isHibernating(result.response.body)){
// callbackError=error;
// }
/**
 * Write this block.
 * If an error was returned, we need to emit OFFLINE.
 * Log the returned error using IAP's global log object
 * at an error severity. In the log message, record
 * this.id so an administrator will know which ServiceNow
 * adapter instance wrote the log message in case more
 * than one instance is configured.
 * If an optional IAP callback function was passed to
 * healthcheck(), execute it passing the error seen as an argument
 * for the callback's errorMessage parameter.
 */
else {
this.emitOnline();
log.debug('instance is available and running'+this.id);
callbackData=result;
// log.info("DONE"+callbackData);
/**
 * Write this block.
 * If no runtime problems were detected, emit ONLINE.
 * Log an appropriate message using IAP's global log object
 * at a debug severity.
 * If an optional IAP callback function was passed to
 * healthcheck(), execute it passing this function's result
 * parameter as an argument for the callback function's
 * responseData parameter.
 */
 }
 });
 
this.postRecord((result,error) =>{
if (error) {
this.emitOffline();
log.error('service Instance is offline'+this.id);
callbackError=error;
 }
else {
this.emitOnline();
log.debug('instance is available and running'+this.id);
callbackData=result;
 }

});
 
}

    




/**
 * @memberofServiceNowAdapter
 * @methodemitOffline
 * @summary Emit OFFLINE
 * @description Emits an OFFLINE event to IAP indicating the external
 * system is not available.
 */
emitOffline() {
this.emitStatus('OFFLINE');
log.warn('ServiceNow: Instance is unavailable.');
 }
 
/**
 * @memberofServiceNowAdapter
 * @methodemitOnline
 * @summary Emit ONLINE
 * @description Emits an ONLINE event to IAP indicating external
 * system is available.
 */
emitOnline() {
this.emitStatus('ONLINE');
log.info('ServiceNow: Instance is available and running good');
 }
 
/**
 * @memberofServiceNowAdapter
 * @methodemitStatus
 * @summary Emit an Event
 * @description Calls inherited emit method. IAP requires the event
 * and an object identifying the adapter instance.
 *
 * @param{string}status - The event to emit.
 */
emitStatus(status) {
this.emit(status, { id:this.id });
 }
 
/**
 * @memberofServiceNowAdapter
 * @methodgetRecord
 * @summary Get ServiceNow Record
 * @description Retrieves a record from ServiceNow.
 *
 * @param{ServiceNowAdapter~requestCallback}callback - The callback that
 * handles the response.
 */
getRecord(callback) {
this.processedResults((data,error)=>callback(data,error));
 }
 
processedResults(callback){


this.connector.get((data,error)=>{
 
// log.info(`\nResponse returned from GET request:\n${JSON.stringify(data)}`);
//var type= typeof data;
var resultdata=null;
let callbackData=null;
let callbackError=null;
//log.info(data);
//log.info(typeof data);
var i;
console.log(data);


 
if(typeof(data)==='object'){

// let keys= Object.keys(data);
for(var key in data){
if(key==="body"){
 
if(this.connector.isHibernating(data,key)){
callbackError=error;
 }
 

// console.log(data[key]);
var jsonobj=JSON.parse(data[key]);

//jsonobj.return[0].splice(0,6);
 ['parent','reason','watch_list','upon_reject','sys_updated_on','type','approval_history','test_plan',
'cab_delegate','requested_by_date','state','sys_created_by','knowledge','order','phase','cmdb_ci','delivery_plan','contract',
'work_notes_list','impact','priority','sys_domain_path','cab_recommendation','production_system',
'review_date','business_duration','group_list','requested_by','change_plan','implementation_plan','approval_set',
'end_date','short_description','correlation_display','delivery_task','additional_assignee_list','outside_maintenance_schedule',
'std_change_producer_version','service_offering','sys_class_name','closed_by','follow_up','reassignment_count',
'review_status','assigned_to','start_date','sla_due','comments_and_work_notes','escalation','upon_approval','correlation_id',
'made_sla','backout_plan','conflict_status','sys_updated_by','opened_by','user_input','sys_created_on','on_hold_task',
'sys_domain','closed_at','review_comments','business_service','time_worked','expected_start','opened_at','phase_state',
'cab_date','work_notes','close_code','assignment_group','on_hold_reason','calendar_duration','close_notes',
'contact_type','cab_required','urgency','scope','company','justification','activity_due','approval','comments',
'due_date','sys_mod_count','on_hold','sys_tags','conflict_last_run','unauthorized',
'location','risk','category','risk_impact_analysis'].forEach(e=>deletejsonobj.result[0][e]);
// console.log(jsonobj.result[0]);



    

jsonobj.result[0].change_ticket_key=jsonobj.result[0].sys_id;
jsonobj.result[0].change_ticket_number=jsonobj.result[0].number;
deletejsonobj.result[0].sys_id;
deletejsonobj.result[0].number;
 
// jsonobj.result[0].change_ticket_key = jsonobj.result[0].sys_id;
// delete jsonobj.return[0].sys_id;
//console.log(jsonobj.result[0]);
// for(var i=0;i<jsonobj.length;i++){
// data=data+jsonobj[i];
// }
for(var key in jsonobj){
if(key==="result"){
data=jsonobj[key];
 }
}
// var datalength= jsonobj.result.length;
// for(var i=0;i<datalength;i++){
// data= jsonobj.result;
// }
 
//data= jsonobj[result];
console.log(data);


 }
//

 }

callbackData=data;

 }
else{
callbackError=error;
 }


callback(callbackData,callbackError)
 });

/**
 * Write the body for this function.
 * The function is a wrapper for this.connector's get() method.
 * Note how the object was instantiated in the constructor().
 * get() takes a callback function.
 */
 }
 
/**
 * @memberofServiceNowAdapter
 * @methodpostRecord
 * @summary Create ServiceNow Record
 * @description Creates a record in ServiceNow.
 *
 * @param{ServiceNowAdapter~requestCallback}callback - The callback that
 * handles the response.
 */
postRecord(callback) {
this.processedPost((data,error)=>callback(data,error));
 }
processedPost(callback){


this.connector.post((data,error)=>{
 
// log.info(`\nResponse returned from GET request:\n${JSON.stringify(data)}`);
//var type= typeof data;
var resultdata=null;
let callbackData=null;
let callbackError=null;
//log.info(data);
//log.info(typeof data);
var i;
//console.log(data);
if(typeof(data)==='object'){

// let keys= Object.keys(data);
for(var key in data){
if(key==="body"){
// console.log(data[key]);
var jsonobj=JSON.parse(data[key]);
//jsonobj.return[0].splice(0,6);
 ['parent','reason','watch_list','upon_reject','sys_updated_on','type','approval_history','test_plan',
'cab_delegate','requested_by_date','state','sys_created_by','knowledge','order','phase','cmdb_ci','delivery_plan','contract',
'work_notes_list','impact','priority','sys_domain_path','cab_recommendation','production_system',
'review_date','business_duration','group_list','requested_by','change_plan','implementation_plan','approval_set',
'end_date','short_description','correlation_display','delivery_task','additional_assignee_list','outside_maintenance_schedule',
'std_change_producer_version','service_offering','sys_class_name','closed_by','follow_up','reassignment_count',
'review_status','assigned_to','start_date','sla_due','comments_and_work_notes','escalation','upon_approval','correlation_id',
'made_sla','backout_plan','conflict_status','sys_updated_by','opened_by','user_input','sys_created_on','on_hold_task',
'sys_domain','closed_at','review_comments','business_service','time_worked','expected_start','opened_at','phase_state',
'cab_date','work_notes','close_code','assignment_group','on_hold_reason','calendar_duration','close_notes',
'contact_type','cab_required','urgency','scope','company','justification','activity_due','approval','comments',
'due_date','sys_mod_count','on_hold','sys_tags','conflict_last_run','unauthorized',
'location','risk','category','risk_impact_analysis'].forEach(e=>deletejsonobj.result[e]);
// console.log(jsonobj.result[0]);

// delete jsonobj.result[0].parent;
jsonobj.result.change_ticket_key=jsonobj.result.sys_id;
jsonobj.result.change_ticket_number=jsonobj.result.number;
deletejsonobj.result.sys_id;
deletejsonobj.result.number;
 
for(var key in jsonobj){
if(key==="result"){
data=jsonobj[key];
 }
}
 
//data= jsonobj;
console.log(data);


 }
//

 }

callbackData=data;

 }
else{
callbackError=error;
 }


callback(callbackData,callbackError)
 });

/**
 * Write the body for this function.
 * The function is a wrapper for this.connector's get() method.
 * Note how the object was instantiated in the constructor().
 * get() takes a callback function.
 */
 }
// processedPostresult(callback){
// let callbackData=null;
// let callbackError=null;

// /**
// * Write the body for this function.
// * The function is a wrapper for this.connector's post() method.
// * Note how the object was instantiated in the constructor().
// * post() takes a callback function.
// */

// }
// }
}
 
module.exports=ServiceNowAdapter;