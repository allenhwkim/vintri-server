const sinon = require("sinon");
const expect = require('chai').expect;

const dependencyModule = require("./dependencyModule");
const { getTheSecret } = require("./moduleUnderTest");

describe("moduleUnderTest", function () {
  describe("when the secret is 3", function () {
    it('should be returned with a string prefix', function () {
      sinon.stub(dependencyModule, "getSecretNumber").returns(3);
      expect(getTheSecret()).to.equal("The secret was: 3");
    });
  });
});