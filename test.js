import { strict as assert } from "assert";
import { Runner } from "near-runner"

// 1. Create testing accounts and deploy a contract
async function initRunner() {
  return await Runner.create(async ({ root }) => ({
    contract: await root.createAndDeploy(
      'status-message',
      "./res/status_message.wasm"
    ),
    alice: await root.createAccount('alice', {initialBalance: "100000000000000000000000000000000"}),
  }))
}

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}


async function testRandomNumbers(runner) {
  await runner.run(async ({ alice, contract }) => {
    const r = await alice.call(contract, "get_random_numbers", {});
    let duplicates = findDuplicates(r);
    console.log(`The duplicates in [${r}] are: [${duplicates}]`);
    // assert.strictEqual(duplicates.length, 0, "No debe hacer numeros duplicados")
  })
}

async function testRandom(runner) {
  await runner.run(async ({ alice, contract }) => {
    const r = await alice.call(contract, "get_random", {});
    // let duplicates = findDuplicates(r);
    // console.log(r);
    // assert.strictEqual(duplicates.length, 0, "No debe hacer numeros duplicados")
  })
}

async function test() {
  const runner = await initRunner()
  await Promise.all([
    testRandomNumbers(runner),
    testRandom(runner),
  ])
  console.log('\x1b[32mPASSED\x1b[0m')
}

test()
