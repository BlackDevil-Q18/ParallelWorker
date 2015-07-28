//Define('parallelJob',[],function(){
	
	var jobList = {};
	var parallelJob = function(options,_parent){
								if(options.jobName && !jobList[options.jobName]){
									var jobText = "this.onmessage ="+options.onmessage;
									var jobWorker = document.createElement("script");
									var content = document.createTextNode(jobText);
									jobWorker.appendChild(content);
									jobWorker.setAttribute('id','workerID');
									jobWorker.setAttribute('type','javascript/-script');
									var parent = _parent?_parent:document.body;
									parent.appendChild(jobWorker);
									jobList[options.jobName] = jobWorker;
									return jobWorker;
								}else{
									return jobList[options.jobName];
								}
						}
//	return parallelJob;
//})
