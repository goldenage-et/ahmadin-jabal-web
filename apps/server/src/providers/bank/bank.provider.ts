import { Injectable } from "@nestjs/common";
import { BankClientBase } from "./bank.core";
import { Cbe } from "./clients/cbe.client";
import { Dashen } from "./clients/dashen.client";

@Injectable()
export class BankProvider extends BankClientBase {
    constructor() {
        super();
    }
    readonly clients = [
        new Cbe(),
        new Dashen(),
    ]
}
