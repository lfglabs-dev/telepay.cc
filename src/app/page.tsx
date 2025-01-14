"use client";

import type { FC } from 'react';
import { DownloadIcon, SendIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Page } from '@/components/Page';
import { TransactionItem } from '@/components/Transactions/transactionItem';
import { useRouter } from 'next/navigation';
import { useUserDetails } from '@/utils/telegram';
import { getOrCreateWallet } from '@/utils/storage';
import { useEffect } from 'react';
import { useState } from 'react';
import { getStoredTransactions } from '@/utils/transactions';
import { Transaction } from '@/types/transaction';

const IndexPage: FC = () => {
  const router = useRouter();
  const user = useUserDetails();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(getStoredTransactions());
  }, []);

  useEffect(() => {
    // Only run if user exists and wallet hasn't been initialized yet
    if (user && !wallet) {
      getOrCreateWallet(user.id, user.signatureHash).then((wallet) => {
        setWallet(wallet);
        console.log("wallet", wallet);
      });
    }
  }, [user, wallet]); // Only re-run if user or wallet changes

  return (
    <Page>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full flex flex-col gap-10">
          <CardHeader className="space-y-4 flex flex-col gap-4">
            <div className='flex flex-col gap-2 items-center'>
              <div className="text-sm text-zinc-400">Balance Yielding at <strong className='text-blue-600' >14.43%/year</strong></div>
              <div className="text-4xl font-bold">$430.12</div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/send')}>
                <SendIcon className="mr-2 h-4 w-4" />
                Send
              </Button>
              <Button variant="outline" className="flex-1 text-blue-600 border-zinc-800 hover:bg-blue-200" onClick={() => router.push('/deposit')}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Deposit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <TransactionItem
                    key={tx.hash}
                    hash={tx.hash}
                    name={tx.recipient.name}
                    time={new Date(tx.timestamp).toLocaleTimeString()}
                    amount={tx.amount}
                    avatar={tx.recipient.avatar}
                    verified
                  />
                ))}
              </div>
            ) : (
              null)}
          </CardContent>
        </div>
      </div>
    </Page>
  );
};

export default IndexPage;