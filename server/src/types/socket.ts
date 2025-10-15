export interface SocketEvents {
  'spot:create': (spotData: any) => void;
  'spot:update': (spotData: any) => void;
  'spot:join': (spotId: string) => void;
  'spot:leave': (spotId: string) => void;
  'comment:create': (commentData: any) => void;
  'like:toggle': (likeData: any) => void;
  'user:status': (status: string) => void;
}

export interface ClientToServerEvents extends SocketEvents {}

export interface ServerToClientEvents {
  'spot:new': (spot: any) => void;
  'spot:updated': (spot: any) => void;
  'comment:new': (comment: any) => void;
  'like:updated': (data: any) => void;
  'user:status:updated': (data: any) => void;
}
