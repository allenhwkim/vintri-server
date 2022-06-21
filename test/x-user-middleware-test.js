// Task 4: Unit tests Add applicable unit tests to the express middleware module in Task 3.
// The preferred testing frameworks to use are mocha, chai and sinon, but you are free to use other testing frameworks if you prefer.
// Put the tests in that you think cover the important parts, or what you feel would add to the overall "product quality" of this app.
const sinon = require('sinon');
const expect = require('chai').expect;

const xUserMiddleware = require('../src/x-user-middleware');

describe("xUserMiddleware()", function() {
  let req, res, next;
  myFunc = sinon.stub(xUserMiddleware, 'logRequest').returns(true);

  beforeEach(() => {
    req = { headers: {} }, 
    res = { status: sinon.stub(), send: sinon.stub()}, 
    next = sinon.stub();
  });

  afterEach(() => {
    res.status.reset();
    res.send.reset();
    next.reset();
  });
  
  it("should skip OPTIONS call", function() {
    req = {...req, method: 'OPTIONS'};
    xUserMiddleware.func(req, res, next);
    expect(res.send.calledOnce).to.equal(true); 
  });   

  it('should continue with a valid x-user header', function() {
    req = { headers: {'x-user': 'allenhwkim@gmail.com' }};
    xUserMiddleware.func(req, res, next);
    expect(next.calledOnce).to.equal(true); 
  });

  it('should return 400 with an invalid x-user header', function() {
    req = { headers: {'x-user': 'invalid' }};
    xUserMiddleware.func(req, res, next);
    expect(res.status.withArgs(400).calledOnce).to.equal(true); 
    expect(res.send.calledOnce).to.equal(true);
  });

  it('should return 400 with an empty x-user header', function() {
    req = { headers: {}};
    xUserMiddleware.func(req, res, next);
    expect(res.status.withArgs(400).calledOnce).to.equal(true);
    expect(res.send.calledOnce).to.equal(true);
  });
});
