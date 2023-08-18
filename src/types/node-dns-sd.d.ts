/* eslint-disable functional/no-classes */
// hand-generated from docs, extremely far from perfect

declare module 'node-dns-sd' {
  class DnsSdClass {
    discover(params: DiscoverOptions): Promise<Device[]>;
  }

  interface DiscoverOptions {
    readonly name: string | string[];
    readonly type?: string;
    readonly key?: 'address' | 'fqdn';
    readonly wait?: number;
    readonly quick?: boolean;
    readonly filter?: string | ((device: Device) => boolean);
  }

  interface Device {
    readonly address: string;
    readonly fqdn: string | null;
    readonly modelName: string | null;
    readonly familyName: string | null;
    readonly service: Service | null;
    readonly packet: DnsSdPacket;
  }

  interface Service {
    readonly port: number;
    readonly protocol: string;
    readonly type: string;
  }

  interface DnsSdPacket {
    header: DNSHeader;
    questions: never[];
    answers: DNSAnswer[];
    authorities: {
      name: string;
      count: number;
    }[];
    additionals: DNSAdditional[];
    address: string;
  }

  interface DNSHeader {
    id: number;
    qr: number; // 0: Query, 1: Response
    op: number; // 0: Normal query, 4: Notify, 5: Update
    aa: number;
    tc: number;
    rd: number;
    ra: number;
    z: number;
    ad: number;
    cd: number;
    rc: number;
    questions: number;
    answers: number;
    authorities: number;
    additionals: number;
  }

  type RData = string | object;

  interface DNSAnswer {
    name: string;
    type: string;
    class: string;
    flash: boolean;
    ttl: number;
    rdata?: RData;
    rdata_buffer?: object;
  }

  interface DNSAdditional {
    name: string;
    type: string;
    class: string;
    flash: boolean;
    ttl: number;
    rdata?: RData;
    rdata_buffer?: object;
  }

  const DnsSd: DnsSdClass;

  export = DnsSd;
}
