import assert from 'node:assert';

import { RbacAssignmentAdapter } from '@brainstaff/rbac';

import { RbacInMemoryAssignmentAdapter } from '../src/index.js';

const rbacGraph = {
  rbacAssignment: [],
  rbacItem: [],
  rbacItemChild: [],
  rbacRule: []
};

describe('RbacInMemoryAssignmentAdapter', () => {
  it('should be able to store data in memory', async () => {
    const rbacAssignmentAdapter: RbacAssignmentAdapter = new RbacInMemoryAssignmentAdapter();
    assert.deepEqual(await rbacAssignmentAdapter.load(), []);
    await rbacAssignmentAdapter.store(rbacGraph.rbacAssignment);
    assert.deepEqual(await rbacAssignmentAdapter.load(), rbacGraph.rbacAssignment);
  });
});
