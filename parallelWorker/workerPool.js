
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
