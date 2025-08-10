import { Document } from "../Document/document"
import { Folder } from "../Folder/folder"

export interface Workspace {
    id:string,
    name:string,
    description:string,
    userNationalID:string,
    isDeleted:string,
    createdAt:string
    documents?:Document[],
    folders?:Folder[]
}


export interface WorkspaceData {
  name: string
  id: string
}