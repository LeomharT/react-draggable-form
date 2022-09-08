import React, { Context, MutableRefObject } from "react";

export type AppContextType = {
    dragging: boolean;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
    dragType: MutableRefObject<ExerciseType>;
};

export enum ExerciseType
{
    BLANK = '填空题',
    CHOICE = '选择题',
    MULTICHOICE = '多选题',
    SHORTANSWER = '简答题',
    JUDGE = '判断题',
    UPLOAD = '上传附件',
}

const AppContext: Context<AppContextType> = React.createContext<AppContextType>({} as AppContextType);


export default AppContext;
