import { when, then, binding } from 'cucumber-tsflow';
import { testData } from '../config/testData';
import fetch, { Response } from 'node-fetch';
import { expect } from 'chai';

@binding()
export class SumSteps { 

    private response!: Response;
    private responseBody: any;
    private first!: number;
    private second!: number;

    private async sendSumRequest(token: string, first: any, second: any): Promise<void> {
        this.first = Number(first);
        this.second = Number(second);

        this.response = await fetch('http://localhost:3000/sumaction', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            token
            },
            body: JSON.stringify({
            first,
            second
            })
        });

        this.responseBody = await this.response.json();
        }

    @when('I sum two valid numbers')
        public async sumValidNumbers(): Promise<void> {
            await this.sendSumRequest(
                testData.token, 
                testData.firstNumber, 
                testData.secondNumber);
        }
    
    @when('I try to sum numbers with an invalid token')
        public async sumWithInvalidToken(): Promise<void> {
            await this.sendSumRequest(
                testData.badToken, 
                testData.firstNumber, 
                testData.secondNumber);
        }

    @when('I try to sum numbers with no token')
        public async sumWithNoToken(): Promise<void> {
            this.first = testData.firstNumber;
            this.second = testData.secondNumber;
            this.response = await fetch('http://localhost:3000/sumaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first: this.first,
                    second: this.second
                })
            });

            this.responseBody = await this.response.json();
        }

    @when('I sum with a non-numeric first value')
        public async sumWithNonNumericFirstValue(): Promise<void> {
            await this.sendSumRequest(
                testData.token, 
                testData.firstNonNumber, 
                testData.secondNumber);
        }
    
    @when('I sum with a non-numeric second value')
        public async sumWithNonNumericSecondValue(): Promise<void> {
            await this.sendSumRequest(
                testData.token, 
                testData.firstNumber, 
                testData.secondNonNumber);
        }

    @when('I sum two numeric values provided as strings')
        public async sumStrings(): Promise<void> {
            await this.sendSumRequest(
                testData.token, 
                testData.firstStringNumber, 
                testData.secondStringNumber);
        }

    @when('I sum a numeric value and a numeric value provided as a string')
        public async sumNumericAndStringValues(): Promise<void> {
            await this.sendSumRequest(
                testData.token, 
                testData.firstStringNumber, 
                testData.secondNumber);
        }
        
    @then('the sum response status should be {int}')
        public verifySumResponseStatus(status: number): void {
            expect(this.response.status).to.equal(status);
        }

    @then('the sum result should be correct')
        public validateSumResult(): void {
            expect(this.responseBody.result).to.equal(this.first + this.second);
        }

    @then('the sum response status should be null')
        public validateNullResult(): void {
            expect(this.responseBody.result).to.equal(null);
        }

}