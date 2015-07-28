//define('parallelWorker',[],function(){

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
		removeAllListeners	: function(){
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
	
//	return WorkerClass;
//})
