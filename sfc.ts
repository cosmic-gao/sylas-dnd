import fs from 'fs';
import { parse as parseSFC } from '@vue/compiler-sfc';
import { baseParse as parseTemplate, NodeTypes } from '@vue/compiler-dom';
import { parse as parseJS } from '@babel/parser';
import generate from '@babel/generator';

// 读取原始 Vue 文件
const vueCode = fs.readFileSync('MyComponent.vue', 'utf-8');

// 解析 SFC
const { descriptor } = parseSFC(vueCode);

// 解析 template AST
let templateAST = descriptor.template ? parseTemplate(descriptor.template.content) : null;

// -----------------------------
// 插入 <Insert /> 节点函数
function insertNode(astNode: any) {
  if (!astNode) return;

  if (astNode.type === NodeTypes.ROOT || astNode.type === NodeTypes.ELEMENT) {
    if (astNode.children) {
      for (let i = 0; i < astNode.children.length; i++) {
        const child = astNode.children[i];

        // 找到文本节点 "Inserted via AST"
        if (child.type === NodeTypes.TEXT && child.content.includes('Inserted via AST')) {
          // 在文本节点后插入 <Insert />
          astNode.children.splice(i + 1, 0, {
            type: NodeTypes.ELEMENT,
            tag: 'Insert',
            props: [
              { type: 6, name: 'foo', value: { content: 'bar', isQuoted: true } }, // ATTRIBUTE
              { type: 6, name: 'count', value: { content: '1', isQuoted: true } }
            ],
            children: [],
            isSelfClosing: true,
          });
          i++; // 跳过新插入的节点
        }
      }
    }

    // 递归处理子节点
    astNode.children.forEach(insertNode);
  }
}

// 执行插入
insertNode(templateAST);

// -----------------------------
// 生成 template 字符串
function generateTemplate(astNode: any): string {
  if (!astNode) return '';

  if (astNode.type === NodeTypes.ROOT) {
    return astNode.children.map(generateTemplate).join('');
  }

  if (astNode.type === NodeTypes.ELEMENT) {
    const props = (astNode.props || []).map((p: any) => {
      if (p.type === NodeTypes.ATTRIBUTE) return `${p.name}="${p.value?.content || ''}"`;
      if (p.type === NodeTypes.DIRECTIVE) {
        if (p.name === 'ref') return `ref="${p.exp.content}"`;
        return `:${p.name}="${p.exp.content}"`;
      }
      return '';
    }).filter(Boolean).join(' ');

    const children = (astNode.children || []).map(generateTemplate).join('');
    return `<${astNode.tag}${props ? ' ' + props : ''}>${children}</${astNode.tag}>`;
  }

  if (astNode.type === NodeTypes.TEXT) {
    return astNode.content;
  }

  return '';
}

// -----------------------------
// script 保持原样
let scriptStr = '';
if (descriptor.scriptSetup) {
  const scriptAST = parseJS(descriptor.scriptSetup.content, {
    sourceType: 'module',
    plugins: ['typescript']
  });
  scriptStr = `<script lang="ts" setup>\n${generate(scriptAST).code}\n</script>`;
}

// -----------------------------
// style 保持原样
const styleStr = descriptor.styles.map(s => `<style${s.lang ? ` lang="${s.lang}"` : ''}>\n${s.content}\n</style>`).join('\n');

// -----------------------------
// 生成新的 Vue 文件内容
const vueFileContent = `<template>\n${generateTemplate(templateAST)}\n</template>\n\n${scriptStr}\n\n${styleStr}`;

// 写入新文件
fs.writeFileSync('B.vue', vueFileContent);

console.log('B.vue 已生成，<Insert /> 已插入！');
