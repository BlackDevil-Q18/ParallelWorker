# ParallelWorker
HTML5 WebWorkers easy to use implementation


Phase 1:
Basic Operations to be covered:-
1) Register Callback<STATUS==>80%>
  Single Callback
  Multiple Callback
  
2) UnRegister Callback<STATUS==>33%>
  Single Callback Unregister
  Multiple Callback Unregister
  All Callback Unregister
  
3) Execution Time : Ability to add time constraint to the worker job execution and existance.<STATUS==>Not Started>
  Job Execution TimeLimit
  Worker Existance Period
  
4) Result of the job to be passed automatically to the Worker.postMesage().<STATUS==>0%>

Phase 2:
1) Check feasiblity to include ArrayBuffer so as to avoid data cloning.<STATUS==>Not Started>
    Verify UseCase:
      * Can we forward the same object to child workers.
      * Is is possible to create a clone of the ArrayBuffer Data in the Worker as a local Copy.
      * Browser support for ArrayBuffer
2) Check feasibility of a worker to invoke a child worker execution from within.<STATUS==>Not Started>

Phase 3:
1) Worker and Job pooling concept.<STATUS==>Not Started>
