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
  var operation = operation || this.undos.pop();
  if(operation === undefined) return;
  operation.undo();
  this.redos.unshift(operation);
  console.log("i want to undo in cmd mgr",this.undos);
}

CommandManager.prototype.redo=function(operation)
{
  var operation = operation || this.redos.shift();
  if(operation === undefined) return;
  operation.redo();
  this.undos.push(operation);
}

