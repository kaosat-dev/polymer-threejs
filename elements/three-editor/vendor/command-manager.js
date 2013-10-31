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

//manager
CommandManager = function ( )
{
  //undos:[],//for undo redo
  //redos:[]
}



