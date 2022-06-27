const sinon = require("sinon");
const expect = require("chai").expect;

const userUtils = require("./userUtils");
const uApi = require("./userApi");

function aUser(id) {
  return {id, first_name: `firstName${id}`, last_name: `lastName${id}` };
}

describe("userUtils", function () {
  let getPageOfUsersStub;

  // beforeEach(() => getPageOfUsersStub = sinon.stub(require('./userApi'), 'getPageOfUsers'))
  beforeEach(() => getPageOfUsersStub = sinon.stub(uApi, 'getPageOfUsers'))
  afterEach(() => getPageOfUsersStub.restore())

  describe('when a single page of users exists', function() {
    it('should return users from that page', async function() {
      // mock
      getPageOfUsersStub.returns(Promise.resolve({
        page: 1, total_pages: 1, data: [aUser(1), aUser(2), aUser(3)]
      }))

      // run
      const result = await userUtils.getAllUsers();

      // verify
      expect(result.length).to.equal(3);
      expect(getPageOfUsersStub.calledOnce).to.equal(true);
    })
  })

  describe('when multiple pages of users exists', function() {
    it('should return users by page', async function() {
      // set
      const page1Users = {page: 1, total_pages: 2, data: [aUser(1), aUser(2), aUser(3)]};
      const page2Users = {page: 2, total_pages: 2, data: [aUser(4), aUser(5)]};
      getPageOfUsersStub.withArgs(1).returns(Promise.resolve(page1Users));
      getPageOfUsersStub.withArgs(2).returns(Promise.resolve(page2Users));

      // run
      const result = await userUtils.getAllUsers();

      // verify
      expect(result.length).to.equal(5);
      expect(getPageOfUsersStub.callCount).to.equal(2);
    })
  });

});