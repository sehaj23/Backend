import logger from "../../utils/logger";
import { adminJWTVerification } from "../../middleware/jwt";
import { vendorJWTVerification } from "../../middleware/VendorJwt";
import { Socket } from "socket.io";

enum SocketConnectionType {
    Vendor = "Vendor",
    Admin = "Admin",
}

export enum SocketRoomType {
    Vendor = "vendor-room",
    Admin = "admin-room",
}

export const getVendorRoom = (vendorId: string) =>
    `${SocketRoomType.Admin} ${vendorId}`;

const startSocketIO = (io: SocketIO.Server) => {
    io.use(async (s:Socket, next) => {
        logger.info("Socket incoming connection - Middle wear");

        const token: string = s.handshake.query.token;
        if (!token) {
            logger.error("Client Tried to connect without token");
            s.disconnect();
            return next(new Error("Client Tried to connect without token"));
        }

        // checking if it is admin or vendor
        let socketConnectionType: SocketConnectionType;
        const adminDecoded = await adminJWTVerification(token);
        if (adminDecoded !== null)
            socketConnectionType = SocketConnectionType.Admin;
        const vendorDecoded = await vendorJWTVerification(token);
        //@ts-ignore
        if (vendorDecoded !== null && vendorDecoded._id)
            socketConnectionType = SocketConnectionType.Vendor;

        if (!socketConnectionType) {
            logger.error("Token not authenticated");
            s.disconnect();
            return next(new Error("Token not authenticated"));
        }
        s.request.socketConnectionType = socketConnectionType
        return next();

    });
    io.sockets.on("connection", async (s: Socket) => {
        logger.info("Socket incoming connection");

        // getting the token
        const socketConnectionType = s.request.socketConnectionType
        console.log(`socketConnectionType: ${socketConnectionType}`)
        if (socketConnectionType === SocketConnectionType.Admin) {
            s.on("subscribe-bookings", (data: string) => {
                s.join(`${SocketRoomType.Admin}`);
                s.emit("hello", "YOLO")
            });
        } else if (socketConnectionType === SocketConnectionType.Vendor) {
            s.on("subscribe-bookings", (data: string) => {
                //@ts-ignore
                s.join(getVendorRoom("ABC"));
            });
        }
    });
};

export default startSocketIO;
