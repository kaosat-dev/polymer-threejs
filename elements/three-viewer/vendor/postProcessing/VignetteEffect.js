VignetteEffect = function(options)
{
  var options = options || {};
  var offset = options.offset || 0.4;
  var darkness = options.darkness || 5;

  this.pass = new THREE.ShaderPass(THREE.VignetteShader);
  this.pass.uniforms["offset"].value = offset;
  this.pass.uniforms["darkness"].value = darkness;
}
