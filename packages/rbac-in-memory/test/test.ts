import assert from 'node:assert';

import { RbacAssignment, RbacAssignmentAdapter } from '@brainstaff/rbac';

import { RbacInMemoryAssignmentAdapter } from '../src/index.js';

const rbacAssignments: RbacAssignment[] = [];

describe('RbacInMemoryAssignmentAdapter', () => {
  it('should be able to store data in memory', async () => {
    const rbacAssignmentAdapter: RbacAssignmentAdapter = new RbacInMemoryAssignmentAdapter();
    assert.deepEqual(await rbacAssignmentAdapter.load(), []);
    await rbacAssignmentAdapter.store(rbacAssignments);
    assert.deepEqual(await rbacAssignmentAdapter.load(), rbacAssignments);
  });
});
