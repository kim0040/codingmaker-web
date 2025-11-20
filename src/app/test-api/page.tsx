"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      console.log('API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin1234'
        })
      });

      const data = await response.json();
      console.log('Response:', data);
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        apiUrl: apiUrl
      });
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API 연결 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                환경 변수: {process.env.NEXT_PUBLIC_API_URL || '설정되지 않음'}
              </p>
              <p className="text-sm text-muted-foreground">
                테스트 계정: admin / admin1234
              </p>
            </div>
            
            <Button onClick={testConnection} disabled={loading}>
              {loading ? "테스트 중..." : "백엔드 연결 테스트"}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
