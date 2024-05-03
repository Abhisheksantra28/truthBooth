import { MessageInterface } from "@/model/User";


export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<MessageInterface>;

}