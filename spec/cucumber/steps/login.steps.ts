import { given, when, then, binding } from 'cucumber-tsflow';
import { testData } from '../config/testData';
import request from 'supertest';
import { expect } from 'chai';

@binding()
export class LoginSteps { 
  
  private response: any;

  @when('I login with valid credentials') 
      public async loginWithValidCredentials(): Promise<void> {
        this.response = await request('http://localhost:3000')
              .post('/loginaction')
              .set('username', testData.username)
              .set('password', testData.password);
      }

  @when('I login with an incorrect password')
      public async loginWithIncorrectPassword(): Promise<void> {
        this.response = await request('http://localhost:3000')
              .post('/loginaction')
              .set('username', testData.username)
              .set('password', testData.badPassword);
      }

  @when('I login with an incorrect username')
      public async loginWithIncorrectUsername(): Promise<void> {
        this.response = await request('http://localhost:3000')
              .post('/loginaction')
              .set('username', testData.badUsername)
              .set('password', testData.password);
      }

  @then('the response status should be {int}')
      public verifyResponseStatus(status: number): void {
        expect(this.response.status).to.equal(status);
  }

  @then('the response should contain a valid token')
      public verifyValidToken(): void {
      expect(this.response.body.result).to.equal(testData.token);
  }

  @then('the response should indicate unauthorized access')
      public verifyErrorMessage(): void {
      expect(this.response.body.result).to.equal('You are not Authorized');
  }

}