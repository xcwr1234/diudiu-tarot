// 塔罗牌随机性测试脚本
import { testRandomness } from './src/services/tarot';

console.log('🧪 开始塔罗牌随机性测试...\n');

// 运行单次测试
console.log('📊 单次测试 (1000次抽牌):');
testRandomness(1000);

console.log('\n' + '='.repeat(60) + '\n');

// 运行多次测试
console.log('📊 多次测试 (5次×200次抽牌):');
for (let i = 1; i <= 5; i++) {
  console.log(`\n🎯 第 ${i} 次测试:`);
  testRandomness(200);
  console.log('-'.repeat(40));
}

console.log('\n✅ 测试完成！');













