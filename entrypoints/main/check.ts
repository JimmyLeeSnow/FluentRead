import {customModelString, services} from "../utils/option";
import {Config} from "../utils/model";
import {sendErrorMessage} from "../utils/tip";

// 检查翻译前配置
export function checkConfig(config: Config): boolean {
    // 1、检查插件是否开启
    if (!config.on) return false;

    // 2、检查 token 是否已经输入（如果是需要 token 的服务且 token 为空时返回 false）
    if ((services.isUseToken(config.service) && !config.token[config.service])
        || (config.service === services.yiyan && (!config.ak || !config.sk))
        || (config.service === services.baidu && (!config.appid || !config.key))
    ) {
        sendErrorMessage("令牌尚未配置，请前往设置页配置")
        return false;
    }

    // 3、检查模型 model 是否已经选择（如果是 AI 且模型栏为空时返回 false）
    if (services.isAI(config.service) &&
        (!config.model[config.service] ||
            (config.model[config.service] === customModelString && config.customModel[config.service] === ""))) {
        sendErrorMessage("模型尚未配置，请前往设置页配置")
        return false;
    }

    return true;
}


// 检查节点是否需要翻译
export function skipNode(node: Node): boolean {
    // 如果符合条件，则跳过
    return !node || !node.textContent || node.textContent.trim() === "" || hasLoadingSpinner(node) || hasRetryTag(node)
}

// 判断是否有加载动画
export function hasLoadingSpinner(node: any) {
    // 文本节点的下一个节点是否包含加载动画
    if (node.nodeType === Node.TEXT_NODE ) return false;

    if (node.classList.contains('fluent-read-loading')) return true;
    for (let child of node.children) {
        if (hasLoadingSpinner(child)) return true;
    }
    return false;
}

// 判断节点是否有重试属性
export function hasRetryTag(node: any) {
    // 文本节点的下一个节点是否包含重试属性
    if (node.nodeType === Node.TEXT_NODE ) return false;

    if (node.classList.contains('fluent-read-failure')) return true;
    for (let child of node.children) {
        if (hasLoadingSpinner(child)) return true;
    }
    return false;
}