import React, { forwardRef, useCallback, useEffect, useState } from "react";

import { FadeIn } from "../../../../components/effects/FadeIn";
import { Dialog } from "../../../../components/layouts/Dialog";
import { Spacer } from "../../../../components/layouts/Spacer";
import { Stack } from "../../../../components/layouts/Stack";
import { Heading } from "../../../../components/typographies/Heading";
import { useMutation } from "../../../../hooks/useMutation";
import { Space } from "../../../../styles/variables";

const CANCEL = "cancel";
const CHARGE = "charge";

/**
 * @typedef Props
 * @type {object}
 */

/** @type {React.ForwardRefExoticComponent<{Props>} */
export const ChargeDialog = forwardRef(({ onComplete }, ref) => {
  const [zenginCode, setZenginCode] = useState({});
  useEffect(() => {
    (async () => {
      const code = await (
        await fetch("https://zengin-code.github.io/api/banks.json")
      ).json();
      setZenginCode(code);
    })();
  }, []);

  const [branches, setBranches] = useState({});

  const [bankCode, setBankCode] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState(0);

  const clearForm = useCallback(() => {
    setBankCode("");
    setBranchCode("");
    setAccountNo("");
    setAmount(0);
  }, []);

  const [charge] = useMutation("/api/users/me/charge", {
    auth: true,
    method: "POST",
  });

  const handleCodeChange = useCallback(async (e) => {
    setBankCode(e.currentTarget.value);
    setBranchCode("");
    const branches = await (
      await fetch(
        `https://zengin-code.github.io/api/branches/${e.currentTarget.value}.json`,
      )
    ).json();
    setBranches(branches);
  }, []);

  const handleBranchChange = useCallback((e) => {
    setBranchCode(e.currentTarget.value);
  }, []);

  const handleAccountNoChange = useCallback((e) => {
    setAccountNo(e.currentTarget.value);
  }, []);

  const handleAmountChange = useCallback((e) => {
    setAmount(parseInt(e.currentTarget.value, 10));
  }, []);

  const handleCloseDialog = useCallback(
    async (e) => {
      if (e.currentTarget.returnValue === CANCEL) {
        clearForm();
        return;
      }

      await charge({ accountNo, amount, bankCode, branchCode });
      clearForm();
      onComplete();
    },
    [charge, bankCode, branchCode, accountNo, amount, onComplete, clearForm],
  );

  const bankList = Object.entries(zenginCode).map(([code, { name }]) => ({
    code,
    name,
  }));
  const bank = zenginCode[bankCode];
  const branch = branches[branchCode];
  return (
    <Dialog ref={ref} onClose={handleCloseDialog}>
      <section>
        <Heading as="h1">チャージ</Heading>

        <Spacer mt={Space * 2} />
        <form method="dialog">
          <Stack gap={Space * 1}>
            <label>
              銀行コード
              <input
                list="ChargeDialog-bank-list"
                onChange={handleCodeChange}
                value={bankCode}
              />
            </label>

            <datalist id="ChargeDialog-bank-list">
              {bankList.map(({ code, name }) => (
                <option key={code} value={code}>{`${name} (${code})`}</option>
              ))}
            </datalist>

            {bank != null && <FadeIn>銀行名: {bank.name}銀行</FadeIn>}

            <label>
              支店コード
              <input
                list="ChargeDialog-branch-list"
                onChange={handleBranchChange}
                value={branchCode}
              />
            </label>

            <datalist id="ChargeDialog-branch-list">
              {branches != null &&
                Object.values(branches).map((branch) => (
                  <option key={branch.code} value={branch.code}>
                    {branch.name}
                  </option>
                ))}
            </datalist>

            {branch && <FadeIn>支店名: {branch.name}</FadeIn>}

            <label>
              口座番号
              <input
                onChange={handleAccountNoChange}
                type="text"
                value={accountNo}
              />
            </label>

            <label>
              金額
              <input
                min={0}
                onChange={handleAmountChange}
                type="number"
                value={amount}
              />
              Yeen
            </label>

            <div>※実在する通貨がチャージされることはありません</div>

            <menu>
              <button value={CANCEL}>キャンセル</button>
              <button value={CHARGE}>チャージ</button>
            </menu>
          </Stack>
        </form>
      </section>
    </Dialog>
  );
});

ChargeDialog.displayName = "ChargeDialog";
