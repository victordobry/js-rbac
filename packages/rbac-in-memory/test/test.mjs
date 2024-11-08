import assert from 'assert';

import { RbacInMemoryAssignmentAdapter } from "../dist/index.js";

const rbacGraph = {
  rbacAssignment: [],
  rbacItem: [],
  rbacItemChild: [],
  rbacRule: []
};

describe('RbacInMemoryAssignmentAdapter', () => {
  it('should be able to store data in memory', async () => {
    const rbacAssignmentAdapter = new RbacInMemoryAssignmentAdapter();
    assert.deepEqual(rbacAssignmentAdapter.rbacAssignments, []);
    await rbacAssignmentAdapter.store(rbacGraph.rbacAssignment);
    assert.deepEqual(rbacAssignmentAdapter.rbacAssignments, rbacGraph.rbacAssignment);
  });
});
