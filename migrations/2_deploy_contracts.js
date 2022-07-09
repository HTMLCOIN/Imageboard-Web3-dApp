const socialDapp = artifacts.require("socialDapp");

module.exports = function(deployer) {
  deployer.deploy(socialDapp);
};
