Polymer('history-editor', {
  created:function()
  {
    this.commandManager = new CommandManager();
  },
  //api
  addOperation:function(operation)
  {
    this.commandManager.addOperation(operation);
  },
  undo:function()
  {
    this.commandManager.undo();
  },
  redo:function()
  {
    this.commandManager.redo();
  },
  undoMultiple:function(howMany)
  {
    this.commandManager.undoMultiple(howMany);
  },
  redoMultiple:function(howMany)
  {
    this.commandManager.redoMultiple(howMany);
  },
  //event handlers
  //TODO: move this, and the html parts to a different web component
  historyUndo:function(event, detail, sender)
  {
    var model = sender.templateInstance_.model;
    var selectedOperation = model.operation;
    var operationIndex = selectedOperation.index;
    var howMany = (this.commandManager.undos.length-1)-operationIndex+1;

    this.commandManager.undoMultiple(howMany);

    event.preventDefault();
    event.stopPropagation();
  },
  historyRedo:function(event, detail, sender)
  {
    var model = event.target.templateInstance.model;
    var selectedOperation = model.operation;
    var operationIndex = this.commandManager.redos.indexOf(selectedOperation);

    this.commandManager.redoMultiple(operationIndex+1);

    event.preventDefault();
    event.stopPropagation();
  }
});

