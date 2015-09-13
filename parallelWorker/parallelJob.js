//Define('parallelJob',[],function(){
	"use strict";
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
						
//	return parallelJob;
//})
