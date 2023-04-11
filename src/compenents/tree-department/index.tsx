import { Button, Input, message, Tree } from "antd";
import { useState, useEffect } from "react";
import { department } from "../../api/index";

interface Option {
  key: string | number;
  title: string;
  children?: Option[];
}

interface PropInterface {
  type: string;
  text: string;
  onUpdate: (keys: any, title: any) => void;
}

export const TreeDepartment = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectKey, setSelectKey] = useState<any>([]);
  useEffect(() => {
    setLoading(true);
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;

      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        setTreeData(new_arr);
      } else {
        const new_arr: Option[] = [
          {
            key: "",
            title: "全部",
            children: [],
          },
        ];
        setTreeData(new_arr);
      }
      setLoading(false);
    });
  }, []);

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: departments[id][i].name,
          key: departments[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          title: departments[id][i].name,
          key: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onSelect = (selectedKeys: any, info: any) => {
    let label = "全部" + props.text;
    if (info) {
      label = info.node.title;
    }
    props.onUpdate(selectedKeys, label);
    setSelectKey(selectedKeys);
  };

  const onExpand = (selectedKeys: any, info: any) => {
    let label = "全部" + props.text;
    if (info) {
      label = info.node.title;
    }
    props.onUpdate(selectedKeys, label);
    setSelectKey(selectedKeys);
  };

  return (
    <div>
      <div
        className={
          selectKey.length === 0
            ? "mb-8 category-label active"
            : "mb-8 category-label"
        }
        onClick={() => onSelect([], "")}
      >
        全部{props.text}
      </div>
      {treeData.length > 0 && (
        <Tree
          selectedKeys={selectKey}
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
          defaultExpandAll={true}
          switcherIcon={<i className="iconfont icon-icon-fold c-gray" />}
        />
      )}
    </div>
  );
};
