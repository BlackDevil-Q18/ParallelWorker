
//define('parallelWorker',[],function(){
"use strict";
//ParallelJOb: Start
	var jobList = {};

	var jobWrapper = function(job,timeLimit){
		//Timelimit for a job is not supported yet
		return function(MessageEvent){	
			var that = this;
			var result = job(MessageEvent.data);
			that.postMessage(result);	
		};
	};

	var prepareJob = function(options,_parent){
										var jobWrapperText = "var jobWrapper = "+jobWrapper.toString()+";";
										var jobHolder = "var jobHolder = "+options.onmessage.toString()+";";
										var jobText = "this.onmessage =jobWrapper(jobHolder,"+options.timeLimit+")";
										var jobWorker = document.createElement("script");
										var content = document.createTextNode(jobWrapperText +jobHolder+ jobText);
										jobWorker.appendChild(content);
										jobWorker.setAttribute('id',options.jobName);
										jobWorker.setAttribute('type','javascript/WW-script');
										var parent = _parent?_parent:document.body;
										parent.appendChild(jobWorker);
		return jobWorker;
	};
	
	var parallelJob = function(options,_parent){
																		
								if(options.jobName){
									if(!jobList[options.jobName]){
										var  jobWorker = prepareJob(options,_parent);
										jobWorker.jobMessageLink = options.onmessage;
										jobList[options.jobName] = jobWorker;										
										return jobWorker;
									}else if(jobList[options.jobName] && jobList[options.jobName].jobMessageLink!=options.onmessage){
										destroyJob(options.jobName,_parent);
										var  jobWorker = prepareJob(options,_parent);
										jobWorker.jobMessageLink = options.onmessage;
										jobList[options.jobName] = jobWorker;										
										return jobWorker;
									}else{
										return jobList[options.jobName];
									}
								}
						};
						
	var destroyJob = function(jobName,_parent){
									//destroy script tags										
									//remove from the jobList 
									if(jobList[jobName]){
										 var jobElem = document.getElementById(jobName);
										 if(jobElem){
												jobElem.parentNode.removeChild(jobElem);
										 }
										jobList.jobName = undefined;
									}
								};


//ParallelJob: End

//ParallelWorker: Start

var parallelWorker = function(workerJobObject){
								if(typeof(Worker) != 'undefined'){
									var blob = new Blob([workerJobObject.textContent],{type:'text/javascript'});
									if(window.URL){
										this.worker = new Worker(window.URL.createObjectURL(blob));
										this.worker.listenerCallbackList = [];
									}
									this.status = true;
									//create a blob element from WSO text content
									//Create Object URL for the above created 
									//blob with type as 'Application/java-script'
									//set Live status
								}else{
									//fallback to inline job execution
									eval(workerJobObject.textContent);
									this.listenerCallbackList = [];
									this.status = false;
									var self = this;
									this.postMessage = function(data){
										for(var i=0;i<this.listenerCallbackList.length;i++){
											var callbackMethod = self.listenerCallbackList[i];
											callbackMethod(data);
										}
									}
								}
							};
parallelWorker.prototype = {
		dispatchMessage 	: function(message){
			if(this.status===true){
				this.worker.postMessage(message);
			}else{
				if(this.onmessage){
					var eventDup = {};
					eventDup.data = message;
					this.onmessage(eventDup);
				}
			}
		},
		registerListener	: function(callback){
			if(this.status===true){
				this.worker.listenerCallbackList.push(callback);
				if(this.worker.listenerCallbackList.length==1){
					this.worker.onmessage = function(event){
						for(var i=0;i<this.listenerCallbackList.length;i++){
							var callbacktofire = this.listenerCallbackList[i];
							callbacktofire(event.data);
						}
					}
				}
			}else{
				this.listenerCallbackList.push(callback);
			}
		},
		unregisterListener	: function(callback){
					var filterCallback = function(attachedCallback){
						return !(attachedCallback===callback);
					}
					if(this.status===true){
						this.worker.listenerCallbackList = this.worker.listenerCallbackList.filter(filterCallback);
					}else{
						this.listenerCallbackList = this.listenerCallbackList.filter(filterCallback);
					}
		},
		unregisterAllListeners	: function(){
					if(this.status===true){
						this.worker.listenerCallbackList = [];
					}else{
						this.listenerCallbackList = [];
					}
		},
		destroyWorker	   	: function(){
			if(this.status===true){
				this.worker.terminate();
			}
		}
	}
	

//ParallelWorker: End

//	return WorkerClass;
//})

//WorkerPool: Start

var addWorker = function(workerInfo,that){
							if(workerInfo && workerInfo.jobName && workerInfo.job){
										var options = {
														jobName : workerInfo.jobName,
														onmessage : workerInfo.job,
														timeLimit : 2000
														};
										var _parent = document?document.body:window;
										var tempJob = new parallelJob(options,_parent);
										var tempWorker= new parallelWorker(tempJob);
										if(workerInfo.postPublishDestroy && workerInfo.postPublishDestroy===true){
											destroyJob(workerInfo.jobName);
										}
										if(workerInfo.listenerList){
											for(var k=0;k<workerInfo.listenerList.length;k++){
												tempWorker.registerListener(workerInfo.listenerList[k]);	
											}
										}										
									that[workerInfo.jobName] = tempWorker;
									return tempWorker;
							}				
}



var workerPool = function(poolList){
								var that = this;
								for(var i=0;i<poolList.length;i++){
									var workerInfo = poolList[i];
									 addWorker(workerInfo,that);
								}							
							};
							
							
							
workerPool.prototype = {
							updateWorker : function(_newJobOptions){
								var that = this;
								for(var i=0;i<_newJobOptions.length;i++){
									var workerInfo = _newJobOptions[i];
									 addWorker(workerInfo,that);
								}	
							},
							destroyPool : function(){
								var that = this;
								var workersList = Object.keys(that);
								for(var i=0;i<workersList.length;i++){
									var workerTempObj = that[workersList[i]];
									workerTempObj.unregisterAllListeners();
									workerTempObj.destroyWorker();
								}
							},
							destroyWorker : function(workerName){
								if(workerName && this[workerName]){
									var workerTempObj = that[workerName];
									workerTempObj.unregisterAllListeners();
									workerTempObj.destroyWorker();
								}
							}
                        }
//WorkerPool:End
