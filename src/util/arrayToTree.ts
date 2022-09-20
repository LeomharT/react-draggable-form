export function arrayToTree(items: any)
{
    const result = [];   // 存放结果集
    const itemMap: any = {};  //

    // 先转成map存储
    for (const item of items)
    {
        itemMap[item.id] = { ...item, children: [] };
    }

    for (const item of items)
    {
        const id = item.id;
        const pid = item.pid;
        const treeItem = itemMap[id];
        if (pid === 0)
        {
            result.push(treeItem);
        } else
        {
            if (!itemMap[pid])
            {
                itemMap[pid] = {
                    children: [],
                };
            }
            itemMap[pid].children.push(treeItem);
        }

    }
    return result;
}
