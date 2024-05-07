import { MessageInterface } from "@/model/User";


export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<MessageInterface>;

}