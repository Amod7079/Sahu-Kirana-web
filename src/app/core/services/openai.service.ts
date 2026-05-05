import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  // Replace with your actual OpenAI API key
  private apiKey = 'YOUR_API_KEY_HERE';
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() { }

  async generatePaymentReminder(customerName: string, pendingAmount: number, daysSinceLastPayment: number): Promise<string> {
    const prompt = `Write a polite and professional WhatsApp payment reminder for a customer named ${customerName}. They have a pending amount of ₹${pendingAmount}. It has been ${daysSinceLastPayment} days since their last payment. Keep it friendly but clear about the due amount. Keep it short (2-3 sentences max). Use some emojis appropriate for a grocery shop (Kirana shop).`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI message:', error);
      // Fallback message
      return `Hello ${customerName}, your current balance is ₹${pendingAmount}. Please pay soon.`;
    }
  }
}
