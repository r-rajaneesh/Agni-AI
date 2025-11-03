function testfn(t: any) {
	t.nums.push(6);
	t.nums[t.nums.length] = 7;
	t.nums.pop();
}
const testfnm = async (t: any) => {
	t.nums.push(6);
	t.nums[t.nums.length] = 7;
	t.nums.pop();
};
const nums = [1, 2, 3, 4, 5];
const test: any = {};
test.nums = nums;
console.log(test);
testfn(test);
console.log(test);
