//operation "class"
Operation = function ( type, value, target)
{
  this.type = type;
  this.value = value;
  this.target = target;
}

Translation = function ( value, target)
{
  Operation.call( this );
  this.type = "translation";
  this.value = value;
  this.target = target;
}
Translation.prototype = Object.create( Operation.prototype );

Translation.prototype.undo = function()
{
    this.target.position.sub(this.value);
}

Translation.prototype.redo = function()
{
    this.target.position.add(this.value);
}

Rotation = function ( value, target)
{
  Operation.call( this );
  this.type = "rotation";
  this.value = value;
  this.target = target;
}
Rotation.prototype = Object.create( Operation.prototype );

Rotation.prototype.undo = function()
{
    //this.target.position.sub(this.value);
    this.target.rotation.x -= this.value.x;
    this.target.rotation.y -= this.value.y;
    this.target.rotation.z -= this.value.z;
}

Rotation.prototype.redo = function()
{
    this.target.rotation.x += this.value.x;
    this.target.rotation.y += this.value.y;
    this.target.rotation.z += this.value.z;
}

Scaling = function ( value, target)
{
  Operation.call( this );
  this.type = "scaling";
  this.value = value;
  this.target = target;
}
Scaling.prototype = Object.create( Operation.prototype );

Scaling.prototype.undo = function()
{
  this.target.scale.x -= this.value.x;
  this.target.scale.y -= this.value.y;
  this.target.scale.z -= this.value.z;
}

Scaling.prototype.redo = function()
{
  this.target.scale.x += this.value.x;
  this.target.scale.y += this.value.y;
  this.target.scale.z += this.value.z;
}

Deletion = function (target, parentObject)
{
  Operation.call( this );
  this.type = "deletion";
  this.target = target;
  this.parentObject = parentObject;
}
Deletion.prototype = Object.create( Operation.prototype );

Deletion.prototype.undo = function()
{
    this.parentObject.add(this.target);
}

Deletion.prototype.redo = function()
{
  this.parentObject.remove(this.target);
}



//manager
CommandManager = function ( )
{
  this.undos=[];//for undo redo
  this.redos=[];
}

CommandManager.prototype.addOperation=function(operation)
{
  this.undos.push(operation);
  this.redos = [];
  operation.index = this.undos.length - 1;
}

CommandManager.prototype.undo=function(operation)
{
  if(operation !== undefined)
  {
    this.undos.pop();
  }else
  {
    var operation = this.undos.pop();
  }
  //var operation = operation || this.undos.pop();
  if(operation === undefined) return;
  operation.undo();
  this.redos.unshift(operation);
  console.log("undo in cmd mgr",this.undos);

  /*operation.undo();
      this.undos.pop();
      this.redos.unshift(operation);*/
}

CommandManager.prototype.undoMultiple=function(howMany)
{
  for(var i=0;i<howMany;i++)
  {
    this.undo();
  }
}

CommandManager.prototype.redo=function(operation)
{
  var operation = operation || this.redos.shift();
  if(operation === undefined) return;
  operation.redo();
  this.undos.push(operation);
  console.log("redo in cmd mgr",this.undos);
}

CommandManager.prototype.redoMultiple=function(howMany)
{
  for(var i=0;i<howMany;i++)
  {
    this.redo();
  }
}

