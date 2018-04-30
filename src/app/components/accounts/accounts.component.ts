import { Component, OnInit } from '@angular/core';
import {WalletService} from "../../services/wallet.service";
import {NotificationService} from "../../services/notification.service";
import {ModalService} from "../../services/modal.service";
import {AppSettingsService} from "../../services/app-settings.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts = this.walletService.wallet.accounts;

  constructor(private walletService: WalletService, private notificationService: NotificationService, public modal: ModalService, public settings: AppSettingsService) { }

  async ngOnInit() {
  }

  async createAccount() {
    if (this.walletService.walletIsLocked()) {
      return this.notificationService.sendError(`Wallet is locked.`);
    }
    if (!this.walletService.wallet.seed) return this.notificationService.sendError(`Wallet is not configured`);
    if (this.walletService.wallet.accounts.length >= 15) return this.notificationService.sendWarning(`You can only track up to 15 accounts at a time.`);
    const newAccount = await this.walletService.addWalletAccount();
    this.notificationService.sendSuccess(`Successfully created new account ${newAccount.id}`);
  }

  copied() {
    this.notificationService.sendSuccess(`Successfully copied to clipboard!`);
  }

  async deleteAccount(account) {
    if (this.walletService.walletIsLocked()) {
      return this.notificationService.sendWarning(`Wallet must be unlocked.`);
    }
    try {
      await this.walletService.removeWalletAccount(account.id);
      this.notificationService.sendSuccess(`Successfully removed account ${account.id}`);
    } catch (err) {
      this.notificationService.sendError(`Unable to delete account: ${err.message}`);
    }
  }

}
