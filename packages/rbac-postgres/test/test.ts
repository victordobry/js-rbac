import fs from 'node:fs';
import knex from 'knex';

import { RbacPostgresAssignmentAdapter } from '../src/index.js';
import { RbacPostgresItemAdapter } from '../src/index.js';
import { RbacPostgresItemChildAdapter } from '../src/index.js';
import { RbacPostgresRuleAdapter } from '../src/index.js';

// Initializing connection to test DB

let client = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'password',
    database: 'postgres'
  }
});

let expect: Chai.ExpectStatic;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
  await client.raw(`DROP DATABASE IF EXISTS rbac_postgres_test`);
  await client.raw(`CREATE DATABASE rbac_postgres_test`);
  await client.destroy();
  client = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'password',
      database: 'rbac_postgres_test'
    }
  });
  await client.raw(fs.readFileSync('./data/tables.sql', 'utf-8'));
});

after(() => client.destroy());

describe('RbacPostgresItemAdapter', async () => {
  const { expect } = await import('chai');

  const rbacItems = [
    { name: 'admin', type: 'role' },
    { name: 'manager', type: 'role' },
    { name: 'user', type: 'role' },
    { name: 'updateProfile', type: 'permission' },
    { name: 'updateOwnProfile', type: 'permission', rule: 'IsOwnProfile' }
  ];
  const rbacItem = { name: 'region manager', type: 'role' };

  const timeout = 3000;

  it('should store many items', async () => {
    const adapter = new RbacPostgresItemAdapter({ client });
    const result = await adapter.store(rbacItems);
    expect(result).to.be.an('array').that.have.length(5);
    result.forEach((item, index) => expect(item).to.include(rbacItems[index]));
  }).timeout(timeout);

  it('should load all items', async () => {
    const adapter = new RbacPostgresItemAdapter({ client });
    const result = await adapter.load();
    expect(result).to.be.an('array').that.have.length(5);
    const members: any[] = [];
    result.forEach(item => members.push(item.name));
    expect(members).to.have.members(rbacItems.map(item => item.name));
  }).timeout(timeout);

  it('should load all roles', async () => {
    const adapter = new RbacPostgresItemAdapter({ client });
    const result = await adapter.findByType('role');
    expect(result).to.be.an('array').that.have.length(3);
    const members: any[] = [];
    result.forEach(item => members.push(item.name));
    expect(members).to.have.members(rbacItems.reduce((result, item) => {
      if (item.type === 'role') {
        result.push(item.name);
      }
      return result;
    }, [] as any[]));
  }).timeout(timeout);

  it('should create single item', async () => {
    const adapter = new RbacPostgresItemAdapter({ client });
    const result = await adapter.create(rbacItem.name, rbacItem.type);
    expect(result).to.be.an('object').that.include(rbacItem);
  }).timeout(timeout);

  it('should find single item by name', async () => {
    const adapter = new RbacPostgresItemAdapter({ client });
    const result = await adapter.find(rbacItem.name);
    expect(result).to.be.an('object').that.include(rbacItem);
  }).timeout(timeout);
});

describe('RbacPostgresAssignmentAdapter', async () => {
  const { expect } = await import('chai');

  const rbacAssignments: any[] = [];
  const rbacAssignmet: any = {};

  const timeout = 2000;

  it('should store many assignments', async () => {
    rbacAssignments.push({ userId: 'user1', role: 'admin' });
    rbacAssignments.push({ userId: 'user2', role: 'manager' });
    Object.assign(rbacAssignmet, {
      userId: 'user3',
      role: 'manager'
    });

    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.store(rbacAssignments);

    expect(result).to.be.an('array').that.have.length(2);
    expect(result[0]).to.include(rbacAssignments[0]);
    expect(result[1]).to.include(rbacAssignments[1]);
  }).timeout(timeout);

  it('should load all assignment', async () => {
    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.load();
    expect(result).to.be.an('array').that.have.length(2);
    const members: any[] = [];
    result.forEach(item => members.push(item.userId));
    expect(members).to.have.members([rbacAssignments[0].userId, rbacAssignments[1].userId]);
  }).timeout(timeout);

  it('should create single assignment', async () => {
    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.create(rbacAssignmet.userId, rbacAssignmet.role);
    expect(result).to.be.an('object').that.include(rbacAssignmet);
  }).timeout(timeout);

  it('should find single assignments', async () => {
    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.find(rbacAssignmet.userId, rbacAssignmet.role);
    expect(result).to.be.an('object').that.include(rbacAssignmet);
  }).timeout(timeout);

  it('should find all assignments by user', async () => {
    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.findByUserId(rbacAssignmet.userId);
    expect(result).to.be.an('array').that.have.length(1);
    expect(result[0]).to.include(rbacAssignmet);
  }).timeout(timeout);

  it('should delete single assignments', async () => {
    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.delete(rbacAssignmet.userId, rbacAssignmet.role);
    expect(result).to.be.an('object').that.include(rbacAssignmet);
    const remainData = await adapter.load();
    expect(remainData).to.be.an('array').that.have.length(2);
  }).timeout(timeout);

  it('should delete all assignments by user', async () => {
    const adapter = new RbacPostgresAssignmentAdapter({ client });
    const result = await adapter.deleteByUser(rbacAssignments[0].userId);
    expect(result).to.be.an('array').that.deep.include(rbacAssignments[0]);
    const remainData = await adapter.load();
    expect(remainData).to.be.an('array').that.have.length(1);
  }).timeout(timeout);
});

describe('RbacPostgresItemChildAdapter', async () => {
  const { expect } = await import('chai');

  const timeout = 3000;

  const rbacItemChildren = [
    { parent: 'admin', child: 'manager' },
    { parent: 'manager', child: 'user' },
    { parent: 'user', child: 'updateOwnProfile' },
    { parent: 'updateOwnProfile', child: 'updateProfile' },
    { parent: 'admin', child: 'updateProfile' }
  ];
  const rbacItemChild = { parent: 'manager', child: 'region manager' };

  it('should store many children items', async () => {
    const adapter = new RbacPostgresItemChildAdapter({ client });
    const result = await adapter.store(rbacItemChildren);
    expect(result).to.be.an('array').that.have.length(5);
    result.forEach((item, index) => expect(item).to.include(rbacItemChildren[index]));
  }).timeout(timeout);

  it('should load all child items', async () => {
    const adapter = new RbacPostgresItemChildAdapter({ client });
    const result = await adapter.load();
    expect(result).to.be.an('array').that.have.length(5);
    const members: any[] = [];
    result.forEach(item => members.push(item.parent));
    expect(members).to.have.members(rbacItemChildren.map(item => item.parent));
  }).timeout(timeout);

  it('should create single child item', async () => {
    const adapter = new RbacPostgresItemChildAdapter({ client });
    const result = await adapter.create(rbacItemChild.parent, rbacItemChild.child);
    expect(result).to.be.an('object').that.include(rbacItemChild);
  }).timeout(timeout);

  it('should find all children item by parent', async () => {
    const adapter = new RbacPostgresItemChildAdapter({ client });
    const result = await adapter.findByParent(rbacItemChildren[0].parent);
    expect(result).to.be.an('array').that.have.length(2);
  }).timeout(timeout);
});

describe('RbacPostgresRuleAdapter', async () => {
  const { expect } = await import('chai');

  const rbacRules = [
    { name: 'IsOwnProfile' },
    { name: 'IsOwnDocument' }
  ];
  const rbacRule = { name: 'IsGroupLeader' };

  const timeout = 3000;

  it('should store many rules', async () => {
    const adapter = new RbacPostgresRuleAdapter({ client });
    const result = await adapter.store(rbacRules);
    expect(result).to.be.an('array').that.have.length(2);
    result.forEach((item, index) => expect(item).to.include(rbacRules[index]));
  }).timeout(timeout);

  it('should load all rules', async () => {
    const adapter = new RbacPostgresRuleAdapter({ client });
    const result = await adapter.load();
    expect(result).to.be.an('array').that.have.length(2);
    const members: any[] = [];
    result.forEach(item => members.push(item.name));
    expect(members).to.have.members(rbacRules.map(item => item.name));
  }).timeout(timeout);

  it('should create single rule', async () => {
    const adapter = new RbacPostgresRuleAdapter({ client });
    const result = await adapter.create(rbacRule.name);
    expect(result).to.be.an('object').that.include(rbacRule);
  }).timeout(timeout);
});
