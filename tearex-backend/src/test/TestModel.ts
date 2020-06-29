import { Required } from "@tearex/core";

export class TestModel {


    @Required
    test: string;


    public constructor() {
        this.test = "";
    }
}
